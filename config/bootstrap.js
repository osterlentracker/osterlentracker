import paths from './paths';
import cakejs from 'cakejs';
import { Type } from 'Cake/Database/Type';

Type.map('options_bitwise', 'App/Database/Type/OptionsBitwiseType');
Type.map('flags_bitwise', 'App/Database/Type/FlagsBitwiseType');