/* eslint-disable */
// Generated from SLTLxParser.g4 by ANTLR 4.9.3
// jshint ignore: start
import antlr4 from 'antlr4';

const serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786",
    "\u5964\u0003\u001dc\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004",
    "\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0003\u0002\u0003\u0002",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0007\u0003\u0012\n\u0003\f\u0003",
    "\u000e\u0003\u0015\u000b\u0003\u0003\u0003\u0007\u0003\u0018\n\u0003",
    "\f\u0003\u000e\u0003\u001b\u000b\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0005\u0004E\n\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0007\u0004M\n\u0004\f\u0004",
    "\u000e\u0004P\u000b\u0004\u0003\u0005\u0003\u0005\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0007\u0006\\\n\u0006\f\u0006\u000e\u0006_\u000b\u0006\u0005",
    "\u0006a\n\u0006\u0003\u0006\u0002\u0003\u0006\u0007\u0002\u0004\u0006",
    "\b\n\u0002\u0002\u0002l\u0002\f\u0003\u0002\u0002\u0002\u0004\u000e",
    "\u0003\u0002\u0002\u0002\u0006D\u0003\u0002\u0002\u0002\bQ\u0003\u0002",
    "\u0002\u0002\n`\u0003\u0002\u0002\u0002\f\r\u0005\u0004\u0003\u0002",
    "\r\u0003\u0003\u0002\u0002\u0002\u000e\u0013\u0005\u0006\u0004\u0002",
    "\u000f\u0010\u0007\u001c\u0002\u0002\u0010\u0012\u0005\u0006\u0004\u0002",
    "\u0011\u000f\u0003\u0002\u0002\u0002\u0012\u0015\u0003\u0002\u0002\u0002",
    "\u0013\u0011\u0003\u0002\u0002\u0002\u0013\u0014\u0003\u0002\u0002\u0002",
    "\u0014\u0019\u0003\u0002\u0002\u0002\u0015\u0013\u0003\u0002\u0002\u0002",
    "\u0016\u0018\u0007\u001c\u0002\u0002\u0017\u0016\u0003\u0002\u0002\u0002",
    "\u0018\u001b\u0003\u0002\u0002\u0002\u0019\u0017\u0003\u0002\u0002\u0002",
    "\u0019\u001a\u0003\u0002\u0002\u0002\u001a\u001c\u0003\u0002\u0002\u0002",
    "\u001b\u0019\u0003\u0002\u0002\u0002\u001c\u001d\u0007\u0002\u0002\u0003",
    "\u001d\u0005\u0003\u0002\u0002\u0002\u001e\u001f\b\u0004\u0001\u0002",
    "\u001fE\u0007\u0006\u0002\u0002 !\u0007\u0007\u0002\u0002!\"\u0005\u0006",
    "\u0004\u0002\"#\u0007\b\u0002\u0002#E\u0003\u0002\u0002\u0002$%\u0007",
    "\t\u0002\u0002%&\u0005\b\u0005\u0002&\'\u0007\n\u0002\u0002\'(\u0005",
    "\u0006\u0004\f(E\u0003\u0002\u0002\u0002)*\u0007\f\u0002\u0002*+\u0007",
    "\u0007\u0002\u0002+,\u0007\u000b\u0002\u0002,E\u0007\b\u0002\u0002-",
    ".\u0007\u000b\u0002\u0002./\u0007\u0016\u0002\u0002/E\u0007\u000b\u0002",
    "\u000201\u0007\u0017\u0002\u00021E\u0005\u0006\u0004\t23\u0007\u0019",
    "\u0002\u000234\u0007\u0007\u0002\u000245\u0007\u000b\u0002\u000256\u0007",
    "\b\u0002\u00026E\u0005\u0006\u0004\b78\u0007\u0018\u0002\u000289\u0007",
    "\u0007\u0002\u00029:\u0007\u000b\u0002\u0002:;\u0007\b\u0002\u0002;",
    "E\u0005\u0006\u0004\u0007<=\u0007\u0004\u0002\u0002=E\u0005\u0006\u0004",
    "\u0006>?\u0007\r\u0002\u0002?@\u0007\u0007\u0002\u0002@A\u0007\u000b",
    "\u0002\u0002AB\u0007\u001a\u0002\u0002BC\u0007\u000b\u0002\u0002CE\u0007",
    "\b\u0002\u0002D\u001e\u0003\u0002\u0002\u0002D \u0003\u0002\u0002\u0002",
    "D$\u0003\u0002\u0002\u0002D)\u0003\u0002\u0002\u0002D-\u0003\u0002\u0002",
    "\u0002D0\u0003\u0002\u0002\u0002D2\u0003\u0002\u0002\u0002D7\u0003\u0002",
    "\u0002\u0002D<\u0003\u0002\u0002\u0002D>\u0003\u0002\u0002\u0002EN\u0003",
    "\u0002\u0002\u0002FG\f\u0005\u0002\u0002GH\u0007\u0003\u0002\u0002H",
    "M\u0005\u0006\u0004\u0006IJ\f\u0004\u0002\u0002JK\u0007\u0005\u0002",
    "\u0002KM\u0005\u0006\u0004\u0005LF\u0003\u0002\u0002\u0002LI\u0003\u0002",
    "\u0002\u0002MP\u0003\u0002\u0002\u0002NL\u0003\u0002\u0002\u0002NO\u0003",
    "\u0002\u0002\u0002O\u0007\u0003\u0002\u0002\u0002PN\u0003\u0002\u0002",
    "\u0002QR\u0007\f\u0002\u0002RS\u0007\u0007\u0002\u0002ST\u0005\n\u0006",
    "\u0002TU\u0007\u001b\u0002\u0002UV\u0005\n\u0006\u0002VW\u0007\b\u0002",
    "\u0002W\t\u0003\u0002\u0002\u0002X]\u0007\u000b\u0002\u0002YZ\u0007",
    "\u001a\u0002\u0002Z\\\u0007\u000b\u0002\u0002[Y\u0003\u0002\u0002\u0002",
    "\\_\u0003\u0002\u0002\u0002][\u0003\u0002\u0002\u0002]^\u0003\u0002",
    "\u0002\u0002^a\u0003\u0002\u0002\u0002_]\u0003\u0002\u0002\u0002`X\u0003",
    "\u0002\u0002\u0002`a\u0003\u0002\u0002\u0002a\u000b\u0003\u0002\u0002",
    "\u0002\t\u0013\u0019DLN]`"].join("");


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.PredictionContextCache();

export default class SLTLxParser extends antlr4.Parser {

    static grammarFileName = "SLTLxParser.g4";
    static literalNames = [ null, null, null, null, "'true'", "'('", "')'", 
                            "'<'", "'>'", null, null, "'R'", "'U'", "'G'", 
                            "'F'", "'X'", "'|'", "'&'", "'->'", "'<->'", 
                            "'='", "'!'", "'Exists'", "'Forall'", "','", 
                            "';'" ];
    static symbolicNames = [ null, "BIN_CONNECTIVE", "UN_MODAL", "BIN_MODAL", 
                             "TRUE", "LPAREN", "RPAREN", "LTHAN", "GTHAN", 
                             "VARIABLE", "CONSTANT", "R_REL", "SLTL_UNTIL", 
                             "SLTL_GLOBALLY", "SLTL_FINALLY", "SLTL_NEXT", 
                             "OR", "AND", "IMPL", "EQUIVALENT", "EQUAL", 
                             "NOT", "EXISTS", "FORALL", "COMMA", "SEMICOL", 
                             "ENDLINE", "WHITESPACE" ];
    static ruleNames = [ "compilationUnit", "condition", "formula", "module", 
                         "vars" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = SLTLxParser.ruleNames;
        this.literalNames = SLTLxParser.literalNames;
        this.symbolicNames = SLTLxParser.symbolicNames;
    }

    get atn() {
        return atn;
    }

    sempred(localctx, ruleIndex, predIndex) {
    	switch(ruleIndex) {
    	case 2:
    	    		return this.formula_sempred(localctx, predIndex);
        default:
            throw "No predicate with index:" + ruleIndex;
       }
    }

    formula_sempred(localctx, predIndex) {
    	switch(predIndex) {
    		case 0:
    			return this.precpred(this._ctx, 3);
    		case 1:
    			return this.precpred(this._ctx, 2);
    		default:
    			throw "No predicate with index:" + predIndex;
    	}
    };




	compilationUnit() {
	    let localctx = new CompilationUnitContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, SLTLxParser.RULE_compilationUnit);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 10;
	        this.condition();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	condition() {
	    let localctx = new ConditionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, SLTLxParser.RULE_condition);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 12;
	        this.formula(0);
	        this.state = 17;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 13;
	                this.match(SLTLxParser.ENDLINE);
	                this.state = 14;
	                this.formula(0); 
	            }
	            this.state = 19;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,0,this._ctx);
	        }

	        this.state = 23;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===SLTLxParser.ENDLINE) {
	            this.state = 20;
	            this.match(SLTLxParser.ENDLINE);
	            this.state = 25;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 26;
	        this.match(SLTLxParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	formula(_p) {
		if(_p===undefined) {
		    _p = 0;
		}
	    const _parentctx = this._ctx;
	    const _parentState = this.state;
	    let localctx = new FormulaContext(this, this._ctx, _parentState);
	    let _prevctx = localctx;
	    const _startState = 4;
	    this.enterRecursionRule(localctx, 4, SLTLxParser.RULE_formula, _p);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 66;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case SLTLxParser.TRUE:
	            localctx = new TrueContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;

	            this.state = 29;
	            this.match(SLTLxParser.TRUE);
	            break;
	        case SLTLxParser.LPAREN:
	            localctx = new BracketsContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 30;
	            this.match(SLTLxParser.LPAREN);
	            this.state = 31;
	            this.formula(0);
	            this.state = 32;
	            this.match(SLTLxParser.RPAREN);
	            break;
	        case SLTLxParser.LTHAN:
	            localctx = new ToolRefContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 34;
	            this.match(SLTLxParser.LTHAN);
	            this.state = 35;
	            this.module();
	            this.state = 36;
	            this.match(SLTLxParser.GTHAN);
	            this.state = 37;
	            this.formula(10);
	            break;
	        case SLTLxParser.CONSTANT:
	            localctx = new FunctionContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 39;
	            this.match(SLTLxParser.CONSTANT);
	            this.state = 40;
	            this.match(SLTLxParser.LPAREN);
	            this.state = 41;
	            this.match(SLTLxParser.VARIABLE);
	            this.state = 42;
	            this.match(SLTLxParser.RPAREN);
	            break;
	        case SLTLxParser.VARIABLE:
	            localctx = new VarEqContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 43;
	            this.match(SLTLxParser.VARIABLE);
	            this.state = 44;
	            this.match(SLTLxParser.EQUAL);
	            this.state = 45;
	            this.match(SLTLxParser.VARIABLE);
	            break;
	        case SLTLxParser.NOT:
	            localctx = new NegUnaryContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 46;
	            this.match(SLTLxParser.NOT);
	            this.state = 47;
	            this.formula(7);
	            break;
	        case SLTLxParser.FORALL:
	            localctx = new ForallContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 48;
	            this.match(SLTLxParser.FORALL);
	            this.state = 49;
	            this.match(SLTLxParser.LPAREN);
	            this.state = 50;
	            this.match(SLTLxParser.VARIABLE);
	            this.state = 51;
	            this.match(SLTLxParser.RPAREN);
	            this.state = 52;
	            this.formula(6);
	            break;
	        case SLTLxParser.EXISTS:
	            localctx = new ExistsContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 53;
	            this.match(SLTLxParser.EXISTS);
	            this.state = 54;
	            this.match(SLTLxParser.LPAREN);
	            this.state = 55;
	            this.match(SLTLxParser.VARIABLE);
	            this.state = 56;
	            this.match(SLTLxParser.RPAREN);
	            this.state = 57;
	            this.formula(5);
	            break;
	        case SLTLxParser.UN_MODAL:
	            localctx = new UnaryModalContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 58;
	            this.match(SLTLxParser.UN_MODAL);
	            this.state = 59;
	            this.formula(4);
	            break;
	        case SLTLxParser.R_REL:
	            localctx = new R_relationContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 60;
	            this.match(SLTLxParser.R_REL);
	            this.state = 61;
	            this.match(SLTLxParser.LPAREN);
	            this.state = 62;
	            this.match(SLTLxParser.VARIABLE);
	            this.state = 63;
	            this.match(SLTLxParser.COMMA);
	            this.state = 64;
	            this.match(SLTLxParser.VARIABLE);
	            this.state = 65;
	            this.match(SLTLxParser.RPAREN);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 76;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,4,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                this.state = 74;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
	                switch(la_) {
	                case 1:
	                    localctx = new BinaryBoolContext(this, new FormulaContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, SLTLxParser.RULE_formula);
	                    this.state = 68;
	                    if (!( this.precpred(this._ctx, 3))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
	                    }
	                    this.state = 69;
	                    this.match(SLTLxParser.BIN_CONNECTIVE);
	                    this.state = 70;
	                    this.formula(4);
	                    break;

	                case 2:
	                    localctx = new BinaryModalContext(this, new FormulaContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, SLTLxParser.RULE_formula);
	                    this.state = 71;
	                    if (!( this.precpred(this._ctx, 2))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                    }
	                    this.state = 72;
	                    this.match(SLTLxParser.BIN_MODAL);
	                    this.state = 73;
	                    this.formula(3);
	                    break;

	                } 
	            }
	            this.state = 78;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,4,this._ctx);
	        }

	    } catch( error) {
	        if(error instanceof antlr4.error.RecognitionException) {
		        localctx.exception = error;
		        this._errHandler.reportError(this, error);
		        this._errHandler.recover(this, error);
		    } else {
		    	throw error;
		    }
	    } finally {
	        this.unrollRecursionContexts(_parentctx)
	    }
	    return localctx;
	}



	module() {
	    let localctx = new ModuleContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, SLTLxParser.RULE_module);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 79;
	        this.match(SLTLxParser.CONSTANT);
	        this.state = 80;
	        this.match(SLTLxParser.LPAREN);
	        this.state = 81;
	        this.vars();
	        this.state = 82;
	        this.match(SLTLxParser.SEMICOL);
	        this.state = 83;
	        this.vars();
	        this.state = 84;
	        this.match(SLTLxParser.RPAREN);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	vars() {
	    let localctx = new VarsContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, SLTLxParser.RULE_vars);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 94;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===SLTLxParser.VARIABLE) {
	            this.state = 86;
	            this.match(SLTLxParser.VARIABLE);
	            this.state = 91;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===SLTLxParser.COMMA) {
	                this.state = 87;
	                this.match(SLTLxParser.COMMA);
	                this.state = 88;
	                this.match(SLTLxParser.VARIABLE);
	                this.state = 93;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

SLTLxParser.EOF = antlr4.Token.EOF;
SLTLxParser.BIN_CONNECTIVE = 1;
SLTLxParser.UN_MODAL = 2;
SLTLxParser.BIN_MODAL = 3;
SLTLxParser.TRUE = 4;
SLTLxParser.LPAREN = 5;
SLTLxParser.RPAREN = 6;
SLTLxParser.LTHAN = 7;
SLTLxParser.GTHAN = 8;
SLTLxParser.VARIABLE = 9;
SLTLxParser.CONSTANT = 10;
SLTLxParser.R_REL = 11;
SLTLxParser.SLTL_UNTIL = 12;
SLTLxParser.SLTL_GLOBALLY = 13;
SLTLxParser.SLTL_FINALLY = 14;
SLTLxParser.SLTL_NEXT = 15;
SLTLxParser.OR = 16;
SLTLxParser.AND = 17;
SLTLxParser.IMPL = 18;
SLTLxParser.EQUIVALENT = 19;
SLTLxParser.EQUAL = 20;
SLTLxParser.NOT = 21;
SLTLxParser.EXISTS = 22;
SLTLxParser.FORALL = 23;
SLTLxParser.COMMA = 24;
SLTLxParser.SEMICOL = 25;
SLTLxParser.ENDLINE = 26;
SLTLxParser.WHITESPACE = 27;

SLTLxParser.RULE_compilationUnit = 0;
SLTLxParser.RULE_condition = 1;
SLTLxParser.RULE_formula = 2;
SLTLxParser.RULE_module = 3;
SLTLxParser.RULE_vars = 4;

class CompilationUnitContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SLTLxParser.RULE_compilationUnit;
    }

	condition() {
	    return this.getTypedRuleContext(ConditionContext,0);
	};


}



class ConditionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SLTLxParser.RULE_condition;
    }

	formula = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(FormulaContext);
	    } else {
	        return this.getTypedRuleContext(FormulaContext,i);
	    }
	};

	EOF() {
	    return this.getToken(SLTLxParser.EOF, 0);
	};

	ENDLINE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(SLTLxParser.ENDLINE);
	    } else {
	        return this.getToken(SLTLxParser.ENDLINE, i);
	    }
	};



}



class FormulaContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SLTLxParser.RULE_formula;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class ToolRefContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	LTHAN() {
	    return this.getToken(SLTLxParser.LTHAN, 0);
	};

	module() {
	    return this.getTypedRuleContext(ModuleContext,0);
	};

	GTHAN() {
	    return this.getToken(SLTLxParser.GTHAN, 0);
	};

	formula() {
	    return this.getTypedRuleContext(FormulaContext,0);
	};


}

SLTLxParser.ToolRefContext = ToolRefContext;

class UnaryModalContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	UN_MODAL() {
	    return this.getToken(SLTLxParser.UN_MODAL, 0);
	};

	formula() {
	    return this.getTypedRuleContext(FormulaContext,0);
	};


}

SLTLxParser.UnaryModalContext = UnaryModalContext;

class NegUnaryContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	NOT() {
	    return this.getToken(SLTLxParser.NOT, 0);
	};

	formula() {
	    return this.getTypedRuleContext(FormulaContext,0);
	};


}

SLTLxParser.NegUnaryContext = NegUnaryContext;

class R_relationContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	R_REL() {
	    return this.getToken(SLTLxParser.R_REL, 0);
	};

	LPAREN() {
	    return this.getToken(SLTLxParser.LPAREN, 0);
	};

	VARIABLE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(SLTLxParser.VARIABLE);
	    } else {
	        return this.getToken(SLTLxParser.VARIABLE, i);
	    }
	};


	COMMA() {
	    return this.getToken(SLTLxParser.COMMA, 0);
	};

	RPAREN() {
	    return this.getToken(SLTLxParser.RPAREN, 0);
	};


}

SLTLxParser.R_relationContext = R_relationContext;

class BinaryBoolContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	formula = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(FormulaContext);
	    } else {
	        return this.getTypedRuleContext(FormulaContext,i);
	    }
	};

	BIN_CONNECTIVE() {
	    return this.getToken(SLTLxParser.BIN_CONNECTIVE, 0);
	};


}

SLTLxParser.BinaryBoolContext = BinaryBoolContext;

class FunctionContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	CONSTANT() {
	    return this.getToken(SLTLxParser.CONSTANT, 0);
	};

	LPAREN() {
	    return this.getToken(SLTLxParser.LPAREN, 0);
	};

	VARIABLE() {
	    return this.getToken(SLTLxParser.VARIABLE, 0);
	};

	RPAREN() {
	    return this.getToken(SLTLxParser.RPAREN, 0);
	};


}

SLTLxParser.FunctionContext = FunctionContext;

class ForallContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	FORALL() {
	    return this.getToken(SLTLxParser.FORALL, 0);
	};

	LPAREN() {
	    return this.getToken(SLTLxParser.LPAREN, 0);
	};

	VARIABLE() {
	    return this.getToken(SLTLxParser.VARIABLE, 0);
	};

	RPAREN() {
	    return this.getToken(SLTLxParser.RPAREN, 0);
	};

	formula() {
	    return this.getTypedRuleContext(FormulaContext,0);
	};


}

SLTLxParser.ForallContext = ForallContext;

class TrueContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	TRUE() {
	    return this.getToken(SLTLxParser.TRUE, 0);
	};


}

SLTLxParser.TrueContext = TrueContext;

class ExistsContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	EXISTS() {
	    return this.getToken(SLTLxParser.EXISTS, 0);
	};

	LPAREN() {
	    return this.getToken(SLTLxParser.LPAREN, 0);
	};

	VARIABLE() {
	    return this.getToken(SLTLxParser.VARIABLE, 0);
	};

	RPAREN() {
	    return this.getToken(SLTLxParser.RPAREN, 0);
	};

	formula() {
	    return this.getTypedRuleContext(FormulaContext,0);
	};


}

SLTLxParser.ExistsContext = ExistsContext;

class BinaryModalContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	formula = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(FormulaContext);
	    } else {
	        return this.getTypedRuleContext(FormulaContext,i);
	    }
	};

	BIN_MODAL() {
	    return this.getToken(SLTLxParser.BIN_MODAL, 0);
	};


}

SLTLxParser.BinaryModalContext = BinaryModalContext;

class BracketsContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	LPAREN() {
	    return this.getToken(SLTLxParser.LPAREN, 0);
	};

	formula() {
	    return this.getTypedRuleContext(FormulaContext,0);
	};

	RPAREN() {
	    return this.getToken(SLTLxParser.RPAREN, 0);
	};


}

SLTLxParser.BracketsContext = BracketsContext;

class VarEqContext extends FormulaContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	VARIABLE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(SLTLxParser.VARIABLE);
	    } else {
	        return this.getToken(SLTLxParser.VARIABLE, i);
	    }
	};


	EQUAL() {
	    return this.getToken(SLTLxParser.EQUAL, 0);
	};


}

SLTLxParser.VarEqContext = VarEqContext;

class ModuleContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SLTLxParser.RULE_module;
    }

	CONSTANT() {
	    return this.getToken(SLTLxParser.CONSTANT, 0);
	};

	LPAREN() {
	    return this.getToken(SLTLxParser.LPAREN, 0);
	};

	vars = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(VarsContext);
	    } else {
	        return this.getTypedRuleContext(VarsContext,i);
	    }
	};

	SEMICOL() {
	    return this.getToken(SLTLxParser.SEMICOL, 0);
	};

	RPAREN() {
	    return this.getToken(SLTLxParser.RPAREN, 0);
	};


}



class VarsContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SLTLxParser.RULE_vars;
    }

	VARIABLE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(SLTLxParser.VARIABLE);
	    } else {
	        return this.getToken(SLTLxParser.VARIABLE, i);
	    }
	};


	COMMA = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(SLTLxParser.COMMA);
	    } else {
	        return this.getToken(SLTLxParser.COMMA, i);
	    }
	};



}




SLTLxParser.CompilationUnitContext = CompilationUnitContext; 
SLTLxParser.ConditionContext = ConditionContext; 
SLTLxParser.FormulaContext = FormulaContext; 
SLTLxParser.ModuleContext = ModuleContext; 
SLTLxParser.VarsContext = VarsContext; 
