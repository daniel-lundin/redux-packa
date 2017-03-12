import {
  Feature,
  Scenario,
  Given,
  When,
  And,
  Then
} from 'kuta/lib/mocha-compat';
import expect from 'expect';
import sinon from 'sinon';

global.Feature = Feature;
global.Scenario = Scenario;
global.Given = Given;
global.When = When;
global.And = And;
global.Then = Then;
global.expect = expect;
global.sinon = sinon;
