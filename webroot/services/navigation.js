class NavigationService {
	navigate(url) {
		window.location.href = url;
	}
	
	get url() {
		return window.location.href;
	}
	
	goBack() {
		window.history.back();
	}
	
	goForward() {
		window.history.forward();
	}
}

export default new NavigationService();