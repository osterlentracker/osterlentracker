//Cake Types
import { Exception } from 'Cake/Core/Exception/Exception';
import { ConnectionManager } from 'Cake/WebSocket/ConnectionManager';
import { Middleware } from 'Cake/Middleware/Middleware'
import { TableRegistry } from 'Cake/ORM/TableRegistry';
import { Configure } from 'Cake/Core/Configure';
import { Text } from 'Cake/Utility/Text';

//Node Modules
import fs from 'fs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import bodyParser from 'body-parser';

export class AuthenticationMiddleware extends Middleware
{	
	initialize()
	{
		this._localStrategy = new LocalStrategy(this._local);
		this._facebookStrategy = new FacebookStrategy({
			clientID: Configure.read('Facebook.login.id'),
			clientSecret: Configure.read('Facebook.login.secret'),
			callbackURL: Configure.read('Web.host')+"/login/facebook/callback"
		},this._facebook);
		
		passport.use(this._localStrategy);
		passport.use(this._facebookStrategy);
		passport.serializeUser(function(id, done) {
			done(null, id);
		});
		passport.deserializeUser(function(id, done) {
			done(null, id);
		});
		
		this.app.use(passport.initialize());
		this.app.post('/login/local', bodyParser.urlencoded({ extended: false }), passport.authenticate('local', { successRedirect: '/login/success',failureRedirect: '/login/failed'}));
		this.app.get('/login/facebook', passport.authenticate('facebook'));
		this.app.get('/login/facebook/callback', passport.authenticate('facebook', { successRedirect: '/',failureRedirect: '/login/failed' }));
		this.app.get('/login/success', this._success.bind(this));
		this.app.get('/login/failed', this._failed.bind(this));
		this.app.get('/logout', (req, res) => {
			req.logout();
			res.redirect('/');
			req.session.destroy();
		});
		this.app.use(async (request, response, next) => {
			try{
				await this._formatRequest(request);
			}catch(e){
				console.log(e);
			}
			next();
		});
	}
	
	async _local(username, password, done)
	{	
		return done(null, false);
	}
	
	async _facebook(accessToken, refreshToken, profile, done)
	{
		var Users = await TableRegistry.get('Users');
		try{
			var user = await Users.find()
					.where({
						facebook_id: profile.id
					}).first();
			if(user === null){
				user = await Users.newEntity({
					facebook_id: profile.id,
					activated: new Date(),
					created: new Date(),
					nickname: profile.displayName
				});
			}
			
			user.last_login = new Date();
			user = await Users.save(user);
			if(user === false){
				throw new Exception("Unable to save to users");
			}
			return done(null, user.id);
		}catch(e){
			console.log("Fel: ", e);
			return done(null, false);
		}
	}
	
	async _formatRequest(request)
	{
		if(request.session !== null && 'passport' in request.session){
			if(await request.session.check('user') === false && 'user' in request.session.passport && typeof request.session.passport.user === 'string'){
				var Users = await TableRegistry.get('Users');
				var user = await Users.find()
					.where({
						id: request.session.passport.user
					})
					.first();
				if(user !== null){
					user = user.jsonSerialize();
					delete user.password;
					await request.session.write('user', user);
				}
				ConnectionManager.forEach((connection) => {
					if(connection.session === request.session){
						connection.emit('AuthenticationGetDetails');
					}
				});
			}
		}
	}
	
	async _failed(request, response)
	{
		try{
			await this._formatRequest(request);
		}catch(e){
			console.log(e);
		}
		response.redirect('/#/Inloggning/misslyckades');
		response.end();
	}
	
	async _success(request, response)
	{
		try{
			await this._formatRequest(request);
		}catch(e){
			console.log(e);
		}
		response.redirect('/#/Inloggning/lyckades');
		response.end();
	}
}