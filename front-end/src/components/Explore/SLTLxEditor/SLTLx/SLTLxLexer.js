// Generated from SLTLxLexer.g4 by ANTLR 4.9.3
// jshint ignore: start
import antlr4 from 'antlr4';



const serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786",
    "\u5964\u0002\u001d\u0098\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003",
    "\u0004\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007",
    "\t\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010",
    "\t\u0010\u0004\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013",
    "\u0004\u0014\t\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017",
    "\t\u0017\u0004\u0018\t\u0018\u0004\u0019\t\u0019\u0004\u001a\t\u001a",
    "\u0004\u001b\t\u001b\u0004\u001c\t\u001c\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0005\u0002>\n\u0002\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0005\u0003C\n\u0003\u0003\u0004\u0003\u0004\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003",
    "\u0007\u0003\u0007\u0003\b\u0003\b\u0003\t\u0003\t\u0003\n\u0003\n\u0006",
    "\nV\n\n\r\n\u000e\nW\u0003\u000b\u0003\u000b\u0006\u000b\\\n\u000b\r",
    "\u000b\u000e\u000b]\u0003\u000b\u0003\u000b\u0003\f\u0003\f\u0003\r",
    "\u0003\r\u0003\u000e\u0003\u000e\u0003\u000f\u0003\u000f\u0003\u0010",
    "\u0003\u0010\u0003\u0011\u0003\u0011\u0003\u0012\u0003\u0012\u0003\u0013",
    "\u0003\u0013\u0003\u0013\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0014",
    "\u0003\u0015\u0003\u0015\u0003\u0016\u0003\u0016\u0003\u0017\u0003\u0017",
    "\u0003\u0017\u0003\u0017\u0003\u0017\u0003\u0017\u0003\u0017\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0019\u0003\u0019\u0003\u001a\u0003\u001a\u0003\u001b\u0006\u001b",
    "\u008e\n\u001b\r\u001b\u000e\u001b\u008f\u0003\u001c\u0006\u001c\u0093",
    "\n\u001c\r\u001c\u000e\u001c\u0094\u0003\u001c\u0003\u001c\u0002\u0002",
    "\u001d\u0003\u0003\u0005\u0004\u0007\u0005\t\u0006\u000b\u0007\r\b\u000f",
    "\t\u0011\n\u0013\u000b\u0015\f\u0017\r\u0019\u000e\u001b\u000f\u001d",
    "\u0010\u001f\u0011!\u0012#\u0013%\u0014\'\u0015)\u0016+\u0017-\u0018",
    "/\u00191\u001a3\u001b5\u001c7\u001d\u0003\u0002\u0005\u0006\u00022;",
    "C\\aac|\u0004\u0002\f\f\u000f\u000f\u0004\u0002\u000b\u000b\"\"\u0002",
    "\u00a0\u0002\u0003\u0003\u0002\u0002\u0002\u0002\u0005\u0003\u0002\u0002",
    "\u0002\u0002\u0007\u0003\u0002\u0002\u0002\u0002\t\u0003\u0002\u0002",
    "\u0002\u0002\u000b\u0003\u0002\u0002\u0002\u0002\r\u0003\u0002\u0002",
    "\u0002\u0002\u000f\u0003\u0002\u0002\u0002\u0002\u0011\u0003\u0002\u0002",
    "\u0002\u0002\u0013\u0003\u0002\u0002\u0002\u0002\u0015\u0003\u0002\u0002",
    "\u0002\u0002\u0017\u0003\u0002\u0002\u0002\u0002\u0019\u0003\u0002\u0002",
    "\u0002\u0002\u001b\u0003\u0002\u0002\u0002\u0002\u001d\u0003\u0002\u0002",
    "\u0002\u0002\u001f\u0003\u0002\u0002\u0002\u0002!\u0003\u0002\u0002",
    "\u0002\u0002#\u0003\u0002\u0002\u0002\u0002%\u0003\u0002\u0002\u0002",
    "\u0002\'\u0003\u0002\u0002\u0002\u0002)\u0003\u0002\u0002\u0002\u0002",
    "+\u0003\u0002\u0002\u0002\u0002-\u0003\u0002\u0002\u0002\u0002/\u0003",
    "\u0002\u0002\u0002\u00021\u0003\u0002\u0002\u0002\u00023\u0003\u0002",
    "\u0002\u0002\u00025\u0003\u0002\u0002\u0002\u00027\u0003\u0002\u0002",
    "\u0002\u0003=\u0003\u0002\u0002\u0002\u0005B\u0003\u0002\u0002\u0002",
    "\u0007D\u0003\u0002\u0002\u0002\tF\u0003\u0002\u0002\u0002\u000bK\u0003",
    "\u0002\u0002\u0002\rM\u0003\u0002\u0002\u0002\u000fO\u0003\u0002\u0002",
    "\u0002\u0011Q\u0003\u0002\u0002\u0002\u0013S\u0003\u0002\u0002\u0002",
    "\u0015Y\u0003\u0002\u0002\u0002\u0017a\u0003\u0002\u0002\u0002\u0019",
    "c\u0003\u0002\u0002\u0002\u001be\u0003\u0002\u0002\u0002\u001dg\u0003",
    "\u0002\u0002\u0002\u001fi\u0003\u0002\u0002\u0002!k\u0003\u0002\u0002",
    "\u0002#m\u0003\u0002\u0002\u0002%o\u0003\u0002\u0002\u0002\'r\u0003",
    "\u0002\u0002\u0002)v\u0003\u0002\u0002\u0002+x\u0003\u0002\u0002\u0002",
    "-z\u0003\u0002\u0002\u0002/\u0081\u0003\u0002\u0002\u00021\u0088\u0003",
    "\u0002\u0002\u00023\u008a\u0003\u0002\u0002\u00025\u008d\u0003\u0002",
    "\u0002\u00027\u0092\u0003\u0002\u0002\u00029>\u0005#\u0012\u0002:>\u0005",
    "!\u0011\u0002;>\u0005%\u0013\u0002<>\u0005\'\u0014\u0002=9\u0003\u0002",
    "\u0002\u0002=:\u0003\u0002\u0002\u0002=;\u0003\u0002\u0002\u0002=<\u0003",
    "\u0002\u0002\u0002>\u0004\u0003\u0002\u0002\u0002?C\u0005\u001b\u000e",
    "\u0002@C\u0005\u001d\u000f\u0002AC\u0005\u001f\u0010\u0002B?\u0003\u0002",
    "\u0002\u0002B@\u0003\u0002\u0002\u0002BA\u0003\u0002\u0002\u0002C\u0006",
    "\u0003\u0002\u0002\u0002DE\u0005\u0019\r\u0002E\b\u0003\u0002\u0002",
    "\u0002FG\u0007v\u0002\u0002GH\u0007t\u0002\u0002HI\u0007w\u0002\u0002",
    "IJ\u0007g\u0002\u0002J\n\u0003\u0002\u0002\u0002KL\u0007*\u0002\u0002",
    "L\f\u0003\u0002\u0002\u0002MN\u0007+\u0002\u0002N\u000e\u0003\u0002",
    "\u0002\u0002OP\u0007>\u0002\u0002P\u0010\u0003\u0002\u0002\u0002QR\u0007",
    "@\u0002\u0002R\u0012\u0003\u0002\u0002\u0002SU\u0007A\u0002\u0002TV",
    "\t\u0002\u0002\u0002UT\u0003\u0002\u0002\u0002VW\u0003\u0002\u0002\u0002",
    "WU\u0003\u0002\u0002\u0002WX\u0003\u0002\u0002\u0002X\u0014\u0003\u0002",
    "\u0002\u0002Y[\u0007)\u0002\u0002Z\\\t\u0002\u0002\u0002[Z\u0003\u0002",
    "\u0002\u0002\\]\u0003\u0002\u0002\u0002][\u0003\u0002\u0002\u0002]^",
    "\u0003\u0002\u0002\u0002^_\u0003\u0002\u0002\u0002_`\u0007)\u0002\u0002",
    "`\u0016\u0003\u0002\u0002\u0002ab\u0007T\u0002\u0002b\u0018\u0003\u0002",
    "\u0002\u0002cd\u0007W\u0002\u0002d\u001a\u0003\u0002\u0002\u0002ef\u0007",
    "I\u0002\u0002f\u001c\u0003\u0002\u0002\u0002gh\u0007H\u0002\u0002h\u001e",
    "\u0003\u0002\u0002\u0002ij\u0007Z\u0002\u0002j \u0003\u0002\u0002\u0002",
    "kl\u0007~\u0002\u0002l\"\u0003\u0002\u0002\u0002mn\u0007(\u0002\u0002",
    "n$\u0003\u0002\u0002\u0002op\u0007/\u0002\u0002pq\u0007@\u0002\u0002",
    "q&\u0003\u0002\u0002\u0002rs\u0007>\u0002\u0002st\u0007/\u0002\u0002",
    "tu\u0007@\u0002\u0002u(\u0003\u0002\u0002\u0002vw\u0007?\u0002\u0002",
    "w*\u0003\u0002\u0002\u0002xy\u0007#\u0002\u0002y,\u0003\u0002\u0002",
    "\u0002z{\u0007G\u0002\u0002{|\u0007z\u0002\u0002|}\u0007k\u0002\u0002",
    "}~\u0007u\u0002\u0002~\u007f\u0007v\u0002\u0002\u007f\u0080\u0007u\u0002",
    "\u0002\u0080.\u0003\u0002\u0002\u0002\u0081\u0082\u0007H\u0002\u0002",
    "\u0082\u0083\u0007q\u0002\u0002\u0083\u0084\u0007t\u0002\u0002\u0084",
    "\u0085\u0007c\u0002\u0002\u0085\u0086\u0007n\u0002\u0002\u0086\u0087",
    "\u0007n\u0002\u0002\u00870\u0003\u0002\u0002\u0002\u0088\u0089\u0007",
    ".\u0002\u0002\u00892\u0003\u0002\u0002\u0002\u008a\u008b\u0007=\u0002",
    "\u0002\u008b4\u0003\u0002\u0002\u0002\u008c\u008e\t\u0003\u0002\u0002",
    "\u008d\u008c\u0003\u0002\u0002\u0002\u008e\u008f\u0003\u0002\u0002\u0002",
    "\u008f\u008d\u0003\u0002\u0002\u0002\u008f\u0090\u0003\u0002\u0002\u0002",
    "\u00906\u0003\u0002\u0002\u0002\u0091\u0093\t\u0004\u0002\u0002\u0092",
    "\u0091\u0003\u0002\u0002\u0002\u0093\u0094\u0003\u0002\u0002\u0002\u0094",
    "\u0092\u0003\u0002\u0002\u0002\u0094\u0095\u0003\u0002\u0002\u0002\u0095",
    "\u0096\u0003\u0002\u0002\u0002\u0096\u0097\b\u001c\u0002\u0002\u0097",
    "8\u0003\u0002\u0002\u0002\t\u0002=BW]\u008f\u0094\u0003\b\u0002\u0002"].join("");


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

export default class SLTLxLexer extends antlr4.Lexer {

    static grammarFileName = "SLTLxLexer.g4";
    static channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	static modeNames = [ "DEFAULT_MODE" ];
	static literalNames = [ null, null, null, null, "'true'", "'('", "')'", 
                         "'<'", "'>'", null, null, "'R'", "'U'", "'G'", 
                         "'F'", "'X'", "'|'", "'&'", "'->'", "'<->'", "'='", 
                         "'!'", "'Exists'", "'Forall'", "','", "';'" ];
	static symbolicNames = [ null, "BIN_CONNECTIVE", "UN_MODAL", "BIN_MODAL", 
                          "TRUE", "LPAREN", "RPAREN", "LTHAN", "GTHAN", 
                          "VARIABLE", "CONSTANT", "R_REL", "SLTL_UNTIL", 
                          "SLTL_GLOBALLY", "SLTL_FINALLY", "SLTL_NEXT", 
                          "OR", "AND", "IMPL", "EQUIVALENT", "EQUAL", "NOT", 
                          "EXISTS", "FORALL", "COMMA", "SEMICOL", "ENDLINE", 
                          "WHITESPACE" ];
	static ruleNames = [ "BIN_CONNECTIVE", "UN_MODAL", "BIN_MODAL", "TRUE", 
                      "LPAREN", "RPAREN", "LTHAN", "GTHAN", "VARIABLE", 
                      "CONSTANT", "R_REL", "SLTL_UNTIL", "SLTL_GLOBALLY", 
                      "SLTL_FINALLY", "SLTL_NEXT", "OR", "AND", "IMPL", 
                      "EQUIVALENT", "EQUAL", "NOT", "EXISTS", "FORALL", 
                      "COMMA", "SEMICOL", "ENDLINE", "WHITESPACE" ];

    constructor(input) {
        super(input)
        this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    }

    get atn() {
        return atn;
    }
}

SLTLxLexer.EOF = antlr4.Token.EOF;
SLTLxLexer.BIN_CONNECTIVE = 1;
SLTLxLexer.UN_MODAL = 2;
SLTLxLexer.BIN_MODAL = 3;
SLTLxLexer.TRUE = 4;
SLTLxLexer.LPAREN = 5;
SLTLxLexer.RPAREN = 6;
SLTLxLexer.LTHAN = 7;
SLTLxLexer.GTHAN = 8;
SLTLxLexer.VARIABLE = 9;
SLTLxLexer.CONSTANT = 10;
SLTLxLexer.R_REL = 11;
SLTLxLexer.SLTL_UNTIL = 12;
SLTLxLexer.SLTL_GLOBALLY = 13;
SLTLxLexer.SLTL_FINALLY = 14;
SLTLxLexer.SLTL_NEXT = 15;
SLTLxLexer.OR = 16;
SLTLxLexer.AND = 17;
SLTLxLexer.IMPL = 18;
SLTLxLexer.EQUIVALENT = 19;
SLTLxLexer.EQUAL = 20;
SLTLxLexer.NOT = 21;
SLTLxLexer.EXISTS = 22;
SLTLxLexer.FORALL = 23;
SLTLxLexer.COMMA = 24;
SLTLxLexer.SEMICOL = 25;
SLTLxLexer.ENDLINE = 26;
SLTLxLexer.WHITESPACE = 27;



