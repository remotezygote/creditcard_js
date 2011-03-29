// Copyright (c) 2008 Thomas Fuchs
// http://script.aculo.us/thomas
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// CreditCard.validate('1111 2222 3333 4444') -> true/false
//   the given string is automatically stripped of whitespace, so it can be
//   plugged directly into form validations
// 
// The following things are tested:
//   1. does the luhn validation code add up? (see http://en.wikipedia.org/wiki/Luhn_algorithm)
//   2. does the number range and length seem right? (see http://en.wikipedia.org/wiki/Bank_card_number)
//   3. is it one of several well-known test numbers?
//
// Card identification via CreditCard.type(string) -> "Visa", "MasterCard", etc.
// Also, CreditCard.isVisa(string) -> true/false (works for all cards given in CARDS)
//
// Be sure to adapt the CARDS array to the credit cards you accept.
//
// Made prototype-free by John Bragg @ Seabright Studios

var CreditCard = {
  CARDS: {
    Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    MasterCard: /^5[1-5][0-9]{14}$/,
    DinersClub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    Amex: /^3[47][0-9]{13}$/,
    Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
  },
  TEST_NUMBERS: ('378282246310005 371449635398431 378734493671000 '+
    '30569309025904 38520000023237 6011111111111117 '+
    '6011000990139424 5555555555554444 5105105105105100 '+
    '4111111111111111 4012888888881881 4222222222222'
  ).split(" "),
  validate: function(number){
    return CreditCard.verifyLuhn10(number) && !!CreditCard.type(number) && !CreditCard.isTestNumber(number);
  },
  verifyLuhn10: function(number){
		var cc = CreditCard.strip(number), sum = 0, end = cc.length-1;
		for (i = end; i > -1; i--) {
	    var c = parseInt(cc.charAt(i), 10);
	    if ((end - i) % 2 != 0) c *= 2;
			c = c.toString();
			for(var l=0;l<c.length;l++) {
				sum += parseInt(c[l],10);
			};
	  };
		return(sum % 10 == 0);
  },
  isTestNumber: function(number){
    return(CreditCard.TEST_NUMBERS.indexOf(CreditCard.strip(number))!=-1);
  },
  strip: function(number) {
    return number.replace(/\s+/g,"");
  },
  type: function(number) {
    for(var card in CreditCard.CARDS) {
      if(CreditCard['is'+card](number)) return card;
		};
		return(undefined);
  },
	bindType: function(card) {
	  var _function = CreditCard.checkType;
	  return function() {
	    return _function.apply(card, arguments);
	  };
	},
	checkType: function(number) {
  	return CreditCard.CARDS[this].test(CreditCard.strip(number));
	}
};

(function(){
  for(var card in CreditCard.CARDS) {
		CreditCard["is"+card] = CreditCard.bindType(card);
	};
})();