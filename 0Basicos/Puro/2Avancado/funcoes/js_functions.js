/*************************************************************************************
	JavaScript Library  v1.0.03

	A recopilation of the best FREE Javascript functions.

	The code exposed here has been found all over the Internet and considered Public 
	Domain. Please feel free to pass this Library to all your friends. This library
	works with browsers that doesnt support Javascript1.2

    Remember to add the following command to the <HEAD> of your HTML/ASP page:
    [script language=javascript src="<path>/js_functions.js"][/script]

	Be sure to check for updates to this library   Comments? Send me an e-mail to 
	bryanbe@yahoo.com.

	Last Modified: 08/01/2000 Bryan Bensing
 *************************************************************************************/

/**************************************************************
 DetectBrowser: Return a string that contains the current 
                browser name and version used.

 Parameters:

 Returns: String
***************************************************************/
function DetectBrowser()
{
	var temp = navigator.appName;
	temp = temp.toLowerCase();

	if (temp == 'microsoft internet explorer')
		return 'IE' + navigator.appVersion
	else
		return 'NS' + navigator.appVersion;
}

/**************************************************************
 OpenURL: Return a concatenated string with all the 'objects
          values' contained in a FORM HTML in the format:
          page_to_redirect.html/asp?object1=xxxx&object2=yyyyy&...

 Parameters:
      URL  = URL to redirect
      Form = Form name (be sure not to use QUOTES when passing
             the Form name)

 Returns: URL

 Example: var redirect = OpenURL('mytest.asp', frmMyForm)
          alert(redirect)
          window.nagivate(redirect)
***************************************************************/
function OpenURL(URL, Form)
{
	if (URL.length == 0 || URL == null)
		return (false);

	var form_length = Form.elements.length;
	var myform = Form;
	var mytype = '';
	var temp = URL + '?';

	for (var i = 0; i < form_length; i++)
	{
		mytype = myform.elements[i].type
		mytype = mytype.toLowerCase();
		if (mytype == 'text' || mytype == 'hidden' || mytype == 'select-one' ||
		    mytype == 'checkbox' || mytype == 'radio' || mytype == 'select-multiple')
		{
			var t = myform.elements[i].name
			if (t == null || t == '')
				t = myform.elements[i].id
			if (mytype == 'text' || mytype == 'hidden')
				temp = temp + t + "=" + escape(myform.elements[i].value);
			else if (mytype == 'checkbox' || mytype == 'radio')
				temp = temp + t + "=" + escape(myform.elements[i].checked);
			else if (mytype == 'select-one' || mytype == 'select-multiple')
				temp = temp + t + "=" + escape(myform.elements[i][myform.elements[i].selectedIndex].value);
			if (i < form_length - 1)
				temp = temp + "&";
		}
	}
	temp = temp.substring(temp, temp.length - 1)

	return temp;
} 

/**************************************************************
 DaysInMonth: Return number of days in a month.

 Parameters:
      dDate = Date to process. If date is null, false is
              returned.

 Returns: Integer
***************************************************************/
function DaysInMonth(dDate)
{
	if (dDate == null)
		return (false);

	dDate = new Date(dDate)

	var dt1, cmn1, cmn2, dtt, lflag, dycnt
	var temp1 = dDate.getMonth() + 1;
	var temp2 = dDate.getYear();
	dt1 = new Date(temp2, temp1 - 1, 1)
	cmn1 = dt1.getMonth()
	dtt = dt1.getTime() + 2332800000
	lflag = true
	dycnt = 28
	while (lflag)
	{
		dtt = dtt + 86400000
		dt1.setTime(dtt)
		cmn2 = dt1.getMonth()
		if (cmn1 != cmn2)
			lflag = false
		else
			dycnt = dycnt + 1;
	}
	if (dycnt > 31)
		dycnt = 31;

    return dycnt;
}

/**************************************************************
 Abs: Returns a value of the same type that is passed to it 
      specifying the absolute value of a number.

 Parameters:
      Number = The required number argument can be any valid 
               numeric expression. If number contains Null, 
               false is returned; if it is an uninitialized 
               variable, false is returned.

 Returns: Long
***************************************************************/
function Abs(Number)
{
	Number = Number.toLowerCase();
	RefString = "0123456789.-";

	if (Number.length < 1) 
		return (false);

	for (var i = 0; i < Number.length; i++) 
	{
		var ch = Number.substr(i, 1)
		var a = RefString.indexOf(ch, 0)
		if (a == -1)
			return (false);
	}

	if (Number < 0)
		return (Number * -1)

	return Number;
}

/**************************************************************
 Len: Returns a Long containing the number of characters in a 
      string or the number of bytes required to store a 
      variable.

 Parameters:
      string = Any valid string expression. If string contains 
               null, false is returned.

 Returns: Long
***************************************************************/
function Len(string)
{
	if (string == null)
		return (false);

	return String(string).length;
}

/**************************************************************
 Chr: Returns a String containing the character associated 
      with the specified character code.

 Parameters:
      CharCode = Long that identifies a character.

 Returns: String
***************************************************************/
function Chr(CharCode)
{
	return String.fromCharCode(CharCode);
}

/**************************************************************
 Asc: Returns an Integer representing the character code 
      corresponding to the first letter in a string

 Parameters:
      String = The required string argument is any valid 
               string expression. If the string if not in 
               the range 32-126, the function return ZERO

 Returns: Integer
***************************************************************/
function Asc(string)
{
	var symbols = " !\"#$%&'()*+'-./0123456789:;<=>?@";
	var loAZ = "abcdefghijklmnopqrstuvwxyz";
	symbols += loAZ.toUpperCase();
	symbols += "[\\]^_`";
	symbols += loAZ;
	symbols += "{|}~";
	var loc;
	loc = symbols.indexOf(string);
	if (loc > -1)
	{ 
		Ascii_Decimal = 32 + loc;
		return (32 + loc);
	}
	return (0);
}

/**************************************************************
 LTrim: Returns a String containing a copy of a specified 
        string without leading spaces 

 Parameters:
      String = The required string argument is any valid 
               string expression. If string contains null, 
               false is returned

 Returns: String
***************************************************************/
function LTrim(String)
{
	var i = 0;
	var j = String.length - 1;

	if (String == null)
		return (false);

	for (i = 0; i < String.length; i++)
	{
		if (String.substr(i, 1) != ' ' &&
		    String.substr(i, 1) != '\t')
			break;
	}

	if (i <= j)
		return (String.substr(i, (j+1)-i));
	else
		return ('');
}

/**************************************************************
 RTrim: Returns a String containing a copy of a specified 
        string without trailing spaces 

 Parameters:
      String = The required string argument is any valid 
               string expression. If string contains null, 
               false is returned

 Returns: String
***************************************************************/
function RTrim(String)
{
	var i = 0;
	var j = String.length - 1;

	if (String == null)
		return (false);

	for(j = String.length - 1; j >= 0; j--)
	{
		if (String.substr(j, 1) != ' ' &&
			String.substr(j, 1) != '\t')
		break;
	}

	if (i <= j)
		return (String.substr(i, (j+1)-i));
	else
		return ('');
}

/**************************************************************
 RTrim: Returns a String containing a copy of a specified 
        string without both leading and trailing spaces 

 Parameters:
      String = The required string argument is any valid 
               string expression. If string contains null, 
               false is returned

 Returns: String
***************************************************************/
function Trim(String)
{
	if (String == null)
		return (false);

	return RTrim(LTrim(String));
}

/**************************************************************
 Left: Returns a String containing a specified number of 
       characters from the left side of a string.

 Parameters:
      String = String expression from which the leftmost 
               characters are returned. If string contains null, 
               false is returned.
      Length = Numeric expression indicating how many characters 
               to return. If 0, a zero-length string ("") is 
               returned. If greater than or equal to the number 
               of characters in string, the entire string is 
               returned. 

 Returns: String
***************************************************************/
function Left(String, Length)
{
	if (String == null)
		return (false);

	return String.substr(0, Length);
}

/**************************************************************
 Right: Returns a String containing a specified number of 
        characters from the right side of a string.

 Parameters:
      String = String expression from which the leftmost 
               characters are returned. If string contains null, 
               false is returned.
      Length = Numeric expression indicating how many characters 
               to return. If 0, a zero-length string ("") is 
               returned. If greater than or equal to the number 
               of characters in string, the entire string is 
               returned. 

 Returns: String
***************************************************************/
function Right(String, Length)
{
	if (String == null)
		return (false);

    var dest = '';
    for (var i = (String.length - 1); i >= 0; i--)
		dest = dest + String.charAt(i);

	String = dest;
	String = String.substr(0, Length);
	dest = '';

    for (var i = (String.length - 1); i >= 0; i--)
		dest = dest + String.charAt(i);

	return dest;
}

/**************************************************************
 Mid: Returns a String containing a specified number of 
      characters from a string

 Parameters:
      String = String expression from which characters are 
               returned. If string contains null, false is 
               returned.
      Start  = Number. Character position in string at which 
               the part to be taken begins. If Start is 
               greater than the number of characters in 
               string, Mid returns a zero-length string ("").
      Length = Number of characters to return. If omitted 
               false is returned. 

 Returns: String
***************************************************************/
function Mid(String, Start, Length)
{
	if (String == null)
		return (false);

	if (Start > String.length)
		return '';

	if (Length == null || Length.length == 0)
		return (false);

	return String.substr((Start - 1), Length);
}

/**************************************************************
 InStr: Returns a Long specifying the position of the first 
        occurrence of one string within another. Is String1
        or String2 are null, false is returned.

 Parameters:
      String1 = String expression being searched.
      String2 = String expression sought

 Returns: Integer
***************************************************************/
function InStr(String1, String2)
{
	var a = 0;

	if (String1 == null || String2 == null)
		return (false);

	String1 = String1.toLowerCase();
	String2 = String2.toLowerCase();

	a = String1.indexOf(String2);
	if (a == -1)
		return 0;
	else
		return a + 1;
}

/**************************************************************
 Sgn: Returns an Integer indicating the sign of a number. If
      Integer is not a number the functions return false.

 Parameters:
      Integer = The number argument can be any valid numeric 
                expression.

 Returns: Integer       -1 If Integer < 0
                         0 If Integer = 0
                         1 If Integer > 0
                     false If Parameter IS NOT NUMERIC
***************************************************************/
function Sgn(Integer)
{
	Number = Integer.toLowerCase();
	RefString = "0123456789-";

	if (Number.length < 1) 
		return (false);

	for (var i = 0; i < Number.length; i++) 
	{
		var ch = Number.substr(i, 1)
		var a = RefString.indexOf(ch, 0)
		if (a == -1)
			return (false);
	}
	if (Integer < 0)
		return (-1);
	else if (Integer == 0)
		return (0);
	else
		return (1);
}

/**************************************************************
 LBound: Returns a Long containing the smallest available 
         subscript for the indicated dimension of an array

 Parameters:
      array = Array to verify

 Returns: Integer       (-1 if Array does not contain
                            any subscript)
***************************************************************/
function LBound(array)
{
	var i = 0;
	var temp = '';

	if (array.length == 0)
		return (-1);

	for (i = 0; i < array.length; i++)
	{
		temp = array[i]
		if (temp != null)
		{
			var temp = i;
			return temp;
		}
	}
	return (-1);
}

/**************************************************************
 UBound: Returns a Long containing the largest available 
         subscript for the indicated dimension of an array

 Parameters:
      array = Array to verify

 Returns: Integer       (-1 if Array does not contain
                            any subscript)
***************************************************************/
function UBound(array)
{
	return (array.length - 1);
}

/**************************************************************
 Join: Returns a string created by joining a number of 
       substrings contained in an array.

 Parameters:
      array     = One-dimensional array containing substrings 
                  to be joined
      Delimiter = String character used to separate the 
                  substrings in the returned string. 
                  If delimiter is a zero-length string (""), 
                  all items in the list are concatenated 
                  with no delimiters. 

 Returns: String
***************************************************************/
function Join(array, Delimiter)
{
	var temp = '';

	if (array.length == 0)
		return '';

	if (Delimiter.length == 0)
		Delimiter = ' ';

	for (var i = 0; i < array.length; i++)
	{
		temp = temp + array[i]
		if (i < array.length - 1)
			temp = temp + Delimiter;
	}
	return temp;
}

/**************************************************************
 ReturnString: Returns a String containing a repeating 
               character string of the length specified

 Parameters:
      Number    = Length of the returned string. If number 
                  is less than 1, false is returned.
      Character = Character code specifying the character or 
                  string expression whose first character is 
                  used to build the return string. If character 
                  contains null, false is returned. 

 Returns: String
***************************************************************/
function ReturnString(Number, Character)
{
	var temp = '';

	if (Number < 1)
		return (false);

	if (Character.length == 0)
		return (false);

	if (Character.length > 1)
		Character = Character.charAt(0);

	for (var i = 0; i < Number; i++)
	{
		temp = temp + Character
	}

	return temp;
}

/**************************************************************
 Split: Returns a zero-based, one-dimensional array containing 
        a specified number of substrings

 Parameters:
      Expression = String expression containing substrings and 
                   delimiters. If expression is a zero-length 
                   string(""), Split returns an empty array, 
                   that is, an array with no elements and no 
                   data.
      Delimiter  = String character used to identify substring 
                   limits. If delimiter is a zero-length 
                   string (""), a single-element array 
                   containing the entire expression string 
                   is returned.

 Returns: String
***************************************************************/
function Split(Expression, Delimiter)
{
	var temp = Expression;
	var a, b = 0;
	var array = new Array();

	if (Delimiter.length == 0)
	{
		array[0] = Expression;
		return (array);
	}

	if (Expression.length == '')
	{
		array[0] = Expression;
		return (array);
	}

	Delimiter = Delimiter.charAt(0);

	for (var i = 0; i < Expression.length; i++) 
	{
		a = temp.indexOf(Delimiter);
		if (a == -1)
		{
			array[i] = temp;
			break;
		}
		else
		{
			b = (b + a) + 1;
			var temp2 = temp.substring(0, a);
			array[i] = temp2;
			temp = Expression.substr(b, Expression.length - temp2.length);
		}
	}

	return (array);
}

/**************************************************************
 Space: Returns a String consisting of the specified number 
        of spaces

 Parameters:
      Number = Number of spaces you want in the string.

 Returns: String
***************************************************************/
function Space(Number)
{
	var temp = '';

	if (Number < 1)
		return '';

	for (var i = 0; i < Number; i++)
	{
		temp = temp + ' ';
	}
	return temp;
}

/**************************************************************
 Replace: Returns a string in which a specified substring has 
          been replaced with another substring a specified 
          number of times.

 Parameters:
      Expression = String expression containing substring to 
                   replace
      Find       = Substring being searched for.
      Replace    = Replacement substring.

 Returns: String
***************************************************************/
function Replace(Expression, Find, Replace)
{
	var temp = Expression;
	var a = 0;

	for (var i = 0; i < Expression.length; i++) 
	{
		a = temp.indexOf(Find);
		if (a == -1)
			break
		else
			temp = temp.substring(0, a) + Replace + temp.substring((a + Find.length));
	}

	return temp;
}

/**************************************************************
 IsChar: Returns a Boolean value indicating whether an 
         expression can be evaluated as a character (this 
         not only includes alpha chars but all symbols such as
         @#$%^&|\_+-/*="!?,.:;'(){}<>[]

 Parameters:
    - Expression = Variant containing a numeric expression or 
                   string expression.

 Returns: Boolean
***************************************************************/
function IsChar(Expression)
{
	Expression = Expression.toLowerCase();
	RefString = "0123456789";

	if (Expression.length < 1) 
		return (false);

	for (var i = 0; i < Expression.length; i++) 
	{
		var ch = Expression.substr(i, 1)
		var a = RefString.indexOf(ch, 0)
		if (a != -1)
			return (false);
	}
	return(true);
}

/**************************************************************
 IsNumber: Returns a Boolean value indicating whether an 
           expression can be evaluated as a number (this
           includes values like $15,656.00)

 Parameters:
      Expression = Variant containing a numeric expression or 
                   string expression.

 Returns: Boolean
***************************************************************/
function IsNumber(Expression)
{
	Expression = Expression.toLowerCase();
	RefString = "0123456789.-";

	if (Expression.length < 1) 
		return (false);

	for (var i = 0; i < Expression.length; i++) 
	{
		var ch = Expression.substr(i, 1)
		var a = RefString.indexOf(ch, 0)
		if (a == -1)
			return (false);
	}
	return(true);
}

/**************************************************************
 IsAlphanumeric: Returns a Boolean value indicating whether an 
                 expression can be evaluated as a number or
                 char.

 Parameters:
      Expression = Variant containing a numeric expression or 
                   string expression.

 Returns: Boolean
***************************************************************/
function IsAlphanumeric(Expression)
{
	Expression = Expression.toLowerCase();
	RefString = "abcdefghijklmnopqrstuvwxyz0123456789 ";

	if (Expression.length < 1) 
		return (false);

	for (var i = 0; i < Expression.length; i++) 
	{
		var ch = Expression.substr(i, 1)
		var a = RefString.indexOf(ch, 0)
		if (a == -1)
			return (false);
	}
	return(true);
}

/**************************************************************
 ReverseString: Returns a string in which the character order 
                of a specified string is reversed

 Parameters:
      Expression = The expression argument is the string whose 
                   characters are to be reversed. If expression 
                   is a zero-length string (""), a zero-length 
                   string is returned. If expression is null,
                   false is returned.

 Returns: String
***************************************************************/
function ReverseString(Expression)
{
	if (Expression == null)
		return (false);

    var dest = '';
    for (var i = (Expression.length - 1); i >= 0; i--)
		dest = dest + Expression.charAt(i);
    return dest;
}

/**************************************************************
 StrConv: Returns a String converted as specified in the
          Parameters Section.

 Parameters:
      String     = String expression to be converted.
      Conversion = Number specifying the type of conversion 
                   to perform.
                   1 = TO UPPER CASE
                   2 = to lower case
                   3 = To Proper Case
                   If Conversion is null or not specified 1
                   is set as default.

 Returns: String
***************************************************************/
function StrConv(String, Conversion)
{
	var index;
	var tmpStr;
	var tmpChar;
	var preString;
	var postString;
	var strlen;

	if (Conversion == null || Conversion.length == 0)
		Conversion = '1';

	if (Conversion != '1' && Conversion != '2' && Conversion != '3')
		Conversion = '1';

	if (Conversion == '1')
		return String.toUpperCase();

	if (Conversion == '2')
		return String.toLowerCase();

	//Proper Case
	tmpStr = String.toLowerCase();
	strLen = tmpStr.length;
	if (strLen > 0)
	{
		for (index = 0; index < strLen; index++)
		{
			if (index == 0)
			{
				tmpChar = tmpStr.substring(0, 1).toUpperCase();
				postString = tmpStr.substring(1, strLen);
				tmpStr = tmpChar + postString;
			}
			else
			{
				tmpChar = tmpStr.substring(index, index + 1);
				if (tmpChar == " " && index < (strLen - 1))
				{
					tmpChar = tmpStr.substring(index + 1, index + 2).toUpperCase();
					preString = tmpStr.substring(0, index + 1);
					postString = tmpStr.substring(index + 2,strLen);
					tmpStr = preString + tmpChar + postString;
				}
			}
		}
	}
	return tmpStr;
}

/**************************************************************
 ComboAdd: Add a new item to a SELECT HTML object at runtime.

 Parameters:
      Object = SELECT Object ID
      Value  = Value of the String ... <option VALUE="?????">....</option>
      String = String to add.

 Returns: None
***************************************************************/
function ComboAdd(Object, Value, String)
{
	Value = Trim(Value)
	String = Trim(String)

	if (Value.length < 1 || String.length < 1)
		return false

	Object[Object.length] = new Option(String, Value);
	Object.selectedIndex = Object.length;
}

/**************************************************************
 ComboDel: Delete the current/selected item from a SELECT 
           HTML object at runtime.

 Parameters:
      Object = SELECT Object ID

 Returns: None
***************************************************************/
function ComboDel(Object)
{
	var selected_index = Object.selectedIndex
	if (selected_index >= 0)
	{
		Object.options[Object.selectedIndex] = null;
		if (selected_index > 0)
			Object.selectedIndex = selected_index
		else
			Object.selectedIndex = 0;
	}
}

/**************************************************************
 FormatNumber: Returns an expression formatted as a number.

 Parameters:
      Expression            = Expression to be formatted.
      NumDigitsAfterDecimal = Numeric value indicating how
                              many places to the right of the
                              decimal are displayed.

 Returns: String
***************************************************************/
function FormatNumber(Expression, NumDigitsAfterDecimal)
{
	var iNumDecimals = NumDigitsAfterDecimal;
	var dbInVal = Expression;
	var bNegative = false;
	var iInVal = 0;
	var strInVal
	var strWhole = "", strDec = "";
	var strTemp = "", strOut = "";
	var iLen = 0;

	if (dbInVal < 0)
	{
		bNegative = true;
		dbInVal *= -1;
	}

	dbInVal = dbInVal * Math.pow(10, iNumDecimals)
	iInVal = parseInt(dbInVal);
	if ((dbInVal - iInVal) >= .5)
	{
		iInVal++;
	}
	strInVal = iInVal + "";
	strWhole = strInVal.substring(0, (strInVal.length - iNumDecimals));
	strDec = strInVal.substring((strInVal.length - iNumDecimals), strInVal.length);
	while (strDec.length < iNumDecimals)
	{
		strDec = "0" + strDec;
	}
	iLen = strWhole.length;
	if (iLen >= 3)
	{
		while (iLen > 0)
		{
			strTemp = strWhole.substring(iLen - 3, iLen);
			if (strTemp.length == 3)
			{
				strOut = "," + strTemp + strOut;
				iLen -= 3;
			}
			else
			{
				strOut = strTemp + strOut;
				iLen = 0;
			}
		}
		if (strOut.substring(0, 1) == ",")
		{
			strWhole = strOut.substring(1, strOut.length);
		}
		else
		{
			strWhole = strOut;
		}
	}
	if (bNegative)
	{
		return "-" + strWhole + "." + strDec;
	}
	else
	{
		return strWhole + "." + strDec;
	}
}

/**************************************************************
 FormatCurrency: Returns an expression formatted as a currency 
                 value using the currency symbol $.

 Parameters:
      Expression = Expression to be formatted.

 Returns: String
***************************************************************/
function FormatCurrency(Expression)
{
	var iNumDecimals = 2;
	var dbInVal = Expression;
	var bNegative = false;
	var iInVal = 0;
	var strInVal
	var strWhole = "", strDec = "";
	var strTemp = "", strOut = "";
	var iLen = 0;

	if (dbInVal < 0)
	{
		bNegative = true;
		dbInVal *= -1;
	}

	dbInVal = dbInVal * Math.pow(10, iNumDecimals)
	iInVal = parseInt(dbInVal);
	if ((dbInVal - iInVal) >= .5)
	{
		iInVal++;
	}
	strInVal = iInVal + "";
	strWhole = strInVal.substring(0, (strInVal.length - iNumDecimals));
	strDec = strInVal.substring((strInVal.length - iNumDecimals), strInVal.length);
	while (strDec.length < iNumDecimals)
	{
		strDec = "0" + strDec;
	}
	iLen = strWhole.length;
	if (iLen >= 3)
	{
		while (iLen > 0)
		{
			strTemp = strWhole.substring(iLen - 3, iLen);
			if (strTemp.length == 3)
			{
				strOut = "," + strTemp + strOut;
				iLen -= 3;
			}
			else
			{
				strOut = strTemp + strOut;
				iLen = 0;
			}
		}
		if (strOut.substring(0, 1) == ",")
		{
			strWhole = strOut.substring(1, strOut.length);
		}
		else
		{
			strWhole = strOut;
		}
	}
	if (bNegative)
	{
		return "-$" + strWhole + "." + strDec;
	}
	else
	{
		return "$" + strWhole + "." + strDec;
	}
}

/**************************************************************
 FormatPercent: Returns an expression formatted as a 
                percentage (multipled by 100) with a 
                trailing % character

 Parameters:
      Expression = Expression to be formatted.

 Returns: String
***************************************************************/
function FormatPercent(Expression, NumDigitsAfterDecimal)
{
	var iNumDecimals = NumDigitsAfterDecimal;
	var dbInVal = Expression * 100;
	var bNegative = false;
	var iInVal = 0;
	var strInVal
	var strWhole = "", strDec = "";
	var strTemp = "", strOut = "";
	var iLen = 0;

	if (dbInVal < 0)
	{
		bNegative = true;
		dbInVal *= -1;
	}

	dbInVal = dbInVal * Math.pow(10, iNumDecimals)
	iInVal = parseInt(dbInVal);
	if ((dbInVal - iInVal) >= .5)
	{
		iInVal++;
	}
	strInVal = iInVal + "";
	strWhole = strInVal.substring(0, (strInVal.length - iNumDecimals));
	strDec = strInVal.substring((strInVal.length - iNumDecimals), strInVal.length);
	while (strDec.length < iNumDecimals)
	{
		strDec = "0" + strDec;
	}
	iLen = strWhole.length;
	if (iLen >= 3)
	{
		while (iLen > 0)
		{
			strTemp = strWhole.substring(iLen - 3, iLen);
			if (strTemp.length == 3)
			{
				strOut = "," + strTemp + strOut;
				iLen -= 3;
			}
			else
			{
				strOut = strTemp + strOut;
				iLen = 0;
			}
		}
		if (strOut.substring(0, 1) == ",")
		{
			strWhole = strOut.substring(1, strOut.length);
		}
		else
		{
			strWhole = strOut;
		}
	}
	if (bNegative)
	{
		return "-" + strWhole + "." + strDec + "%";
	}
	else
	{
		return strWhole + "." + strDec + "%";
	}
}

/**************************************************************
 FormatDateTime: Returns an expression formatted as a date or 
                 time. If DateTime is null then false is
                 returned.

 Parameters:
      DateTime   = Date/Time expression to be formatted
      FormatType = Numeric value that indicates the date/time 
                   format used. If omitted, GeneralDate is used
                   0 = Very Long Date/Time Format (Mon Jul 10, 12:02:30 am EDT 2000)
                   1 = Long Date/Time Format (Monday, July 10, 2000)
                   2 = Short Date (1/10/00)
                   3 = Long Time (4:20 PM)
                   4 = Military Time (14:43)

 Returns: String
***************************************************************/
function FormatDateTime(DateTime, FormatType)
{
	if (DateTime == null)
		return (false);

	if (FormatType < 0)
		FormatType = 1;

	if (FormatType > 4)
		FormatType = 1;

	var strDate = new String(DateTime);

	if (strDate.toUpperCase() == "NOW")
	{
		var myDate = new Date();
		strDate = String(myDate);
	}
	else
	{
		var myDate = new Date(DateTime);
		strDate = String(myDate);
	}

	var Day = new String(strDate.substring(0, 3));
	if (Day == "Sun") Day = "Sunday";
	if (Day == "Mon") Day = "Monday";
	if (Day == "Tue") Day = "Tuesday";
	if (Day == "Wed") Day = "Wednesday";
	if (Day == "Thu") Day = "Thursday";
	if (Day == "Fri") Day = "Friday";
	if (Day == "Sat") Day = "Saturday";	

	var Month = new String(strDate.substring(4, 7)), MonthNumber = 0;
	if (Month == "Jan") { Month = "January"; MonthNumber = 1; }
	if (Month == "Feb") { Month = "February"; MonthNumber = 1; }
	if (Month == "Mar") { Month = "March"; MonthNumber = 1; }
	if (Month == "Apr") { Month = "April"; MonthNumber = 1; }
	if (Month == "May") { Month = "May"; MonthNumber = 1; }
	if (Month == "Jun") { Month = "June"; MonthNumber = 1; }
	if (Month == "Jul") { Month = "July"; MonthNumber = 1; }
	if (Month == "Aug") { Month = "August"; MonthNumber = 1; }
	if (Month == "Sep") { Month = "September"; MonthNumber = 1; }
	if (Month == "Oct") { Month = "October"; MonthNumber = 1; }
	if (Month == "Nov") { Month = "November"; MonthNumber = 1; }
	if (Month == "Dec") { Month = "December"; MonthNumber = 1; }

	var curPos = 11;
	var MonthDay = new String(strDate.substring(8, 10));
	if (MonthDay.charAt(1) == " ")
	{
		MonthDay = "0" + MonthDay.charAt(0);
		curPos--;
	}	

	var MilitaryTime = new String(strDate.substring(curPos, curPos + 5));
	var Year = new String(strDate.substring(strDate.length - 4, strDate.length));

	// Format Type decision time!
	if (FormatType == 1)
		strDate = Day + ", " + Month + " " + MonthDay + ", " + Year;
	else if (FormatType == 2)
		strDate = MonthNumber + "/" + MonthDay + "/" + Year.substring(2,4);
	else if (FormatType == 3)
	{
		var AMPM = MilitaryTime.substring(0,2) >= 12 && MilitaryTime.substring(0,2) != "24" ? " PM" : " AM";
		if (MilitaryTime.substring(0,2) > 12)
			strDate = (MilitaryTime.substring(0,2) - 12) + ":" + MilitaryTime.substring(3,MilitaryTime.length) + AMPM;
		else
		{
			if (MilitaryTime.substring(0,2) < 10)
				strDate = MilitaryTime.substring(1,MilitaryTime.length) + AMPM;
			else
			strDate = MilitaryTime + AMPM;
		}
	}	
	else if (FormatType == 4)
		strDate = MilitaryTime;

	return strDate;
}

/**************************************************************
 Mask: Returns a Boolean if the specified Expression match
       the specified Mask.

 Parameters:
      Expression = String to validate
      Mask       = String that can contain the following
                   options:
                   9 = only numbers (0..9)
                   X = only letters (a..z or A..Z)
                   * = Anything...
 Example: alert(Mask("(954) 572-4419", "(999) 999-9999")); => TRUE
          alert(Mask("33351-820", "99999-9999"));          => FALSE
          alert(Mask("This is a test", "XXXXXX"));         => FALSE
          alert(Mask("This 34 a test", "**************")); => TRUE

 Returns: Boolean
***************************************************************/
function Mask(Expression, Mask)
{
	Mask = Mask.toUpperCase();
	LenStr = Expression.length;
	LenMsk = Mask.length;
	if ((LenStr == 0) || (LenMsk == 0))
		return (false);
	if (LenStr != LenMsk)
		return (false);
	TempString = '';
	for (Count = 0; Count <= Expression.length; Count++)
	{
		StrChar = Expression.substring(Count, Count + 1);
		MskChar = Mask.substring(Count, Count + 1);
		if (MskChar == '9')
		{
			if(!IsNumber(StrChar))
				return (false);
		}
		else if (MskChar == 'X')
		{
			if(!IsChar(StrChar))
				return (false);
		}
		else if (MskChar == '*')
		{
			if(!IsAlphanumeric(StrChar))
				return (false);
		}
		else
		{
			if (MskChar != StrChar) 
				return (false);
		}
	}
	return (true);
}

/**************************************************************
 IsEmail: Returns a Boolean if the specified Expression is a
          valid e-mail address. If Expression is null, false
          is returned.

 Parameters:
      Expression = e-mail to validate.

 Returns: Boolean
***************************************************************/
function IsEmail(Expression)
{
	if (Expression == null)
		return (false);

	var supported = 0;
	if (window.RegExp)
	{
		var tempStr = "a";
		var tempReg = new RegExp(tempStr);
		if (tempReg.test(tempStr)) supported = 1;
	}
	if (!supported) 
		return (Expression.indexOf(".") > 2) && (Expression.indexOf("@") > 0);
	var r1 = new RegExp("(@.*@)|(\\.\\.)|(@\\.)|(^\\.)");
	var r2 = new RegExp("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$");
	return (!r1.test(Expression) && r2.test(Expression));
}

/**************************************************************
 DayOfWeek: Returns a String specifying a name of the day
            for a given date.

 Parameters:
      dDate = Date to evaluate. The Date can be one of the
              following formats: '7/6/2000' or 'July 4, 1830'

 Returns: String
***************************************************************/
function DayOfWeek(dDate)
{
	var ar = new Array();
	ar[0] = "Sunday";   ar[1] = "Monday"; ar[2] = "Tuesday";  ar[3] = "Wednesday";
	ar[4] = "Thursday";	ar[5] = "Friday"; ar[6] = "Saturday";
	var dow = new Date(dDate);
	var day = dow.getDay();
	return ar[day];
}

/**************************************************************
 AddDays: Returns a Date containing a date to which a 
          specified days interval has been added to the
          current date.

 Parameters:
      DaysToAdd = Numeric expression that is the interval of 
                  days you want to add to the actual date.

 Returns: Date/String
***************************************************************/
function AddDays(DaysToAdd)
{
	var newdate = new Date();
	var newtimems = newdate.getTime() + (DaysToAdd * 24 * 60 * 60 * 1000);
	newdate.setTime(newtimems);
	return newdate.toLocaleString();
}

/**************************************************************
 AllowOnly: This function allow entering just the specified
            Expression to a textbox or textarea control.

 Parameters:
      Expression = Allowed characters.
                   a..z => ONLY LETTERS
                   0..9 => ONLY NUMBERS
                   other symbols...

 Example: use the onKeyPress event to make this function work:
          //Allows only from A to Z
          onKeyPress="AllowOnly('a..z');"

          //Allows only from 0 to 9
          onKeyPress="AllowOnly('0..9');"

          //Allows only A,B,C,1,2 and 3
          onKeyPress="AllowOnly('abc123');"

          //Allows only A TO Z,@,#,$ and %
          onKeyPress="AllowOnly('a..z|@#$%');"

		  //Allows only A,B,C,0 TO 9,.,,,+ and -
          onKeyPress="AllowOnly('ABC|0..9|.,+-');"

 Remarks: Use the pipe "|" symbol to separate a..z from 0..9 and symbols

 Returns: None
***************************************************************/
function AllowOnly(Expression)
{
	Expression = Expression.toLowerCase();
	Expression = Replace(Expression, 'a..z', 'abcdefghijklmnopqrstuvwxyz');
	Expression = Replace(Expression, '0..9', '0123456789');
	Expression = Replace(Expression, '|', '');

	var ch = String.fromCharCode(window.event.keyCode);
	ch = ch.toLowerCase();
	Expression = Expression.toLowerCase();
	var a = Expression.indexOf(ch);
	if (a == -1) 
		window.event.keyCode = 0;
}

/**************************************************************
 LeapYear: Return a Boolean if the speficied Year is a Leap
           Year

 Parameters:
      Year = Numeric expression that represents the Year.

 Returns: Boolean
***************************************************************/
function LeapYear(Year)
{    
	if(Year % 4 == 0 && Year % 100 != 0 || Year % 400 ==0)
		return true;
	return false;
}

/**************************************************************
 GeneratePopupMenu: Defines a new MENU for the right-click
                    event. The arrMenu 'array' must have the
                    following syntax:
                    arrMenu('<tool_tip>'|'<function_to_call OR javascript_code>'|'<menu_string'>)

 Parameters:
      arrMenu  = Array containing the NEW menu
      FontFace = The font name (ie: Tahoma, Times New, Helvetica, etc).
                 If FontFace is blank ('') or ('default') Tahoma
                 font will be used
      FontSize = The font size (8, 9, 12, 24, etc). If FontSize
	             is blank ('') or ('default') font size 8
	             will be used

 Returns: Nothing

 Remarks: - This menu works only with IE 4.01+
          - Use <HR> to separate items in the menu

 Example:
 [body]
	[script language=javascript]
	var arrM = new Array()
	arrM[0] = 'Cancel the current Order|btnCancelOrder_OnClick()|Cancel Order'
	arrM[1] = 'Refresh the Current page|window.location.reload()|Refresh Order'
	arrM[2] = '<hr>'
	arrM[3] = 'Search Products by Category|SearchProducts()|Search Products'
	arrM[4] = '<hr>'
	arrM[5] = 'Display the Agency Order History|AgencyOrderHistory()|Order History'
	arrM[6] = 'Shows the Agency Information|AgencyInfo()|Show Agency Info'
	arrM[7] = 'Add a new Agent to the Database|AddNewAgent()|Add New Agent'
	arrM[8] = '<hr>'
	arrM[9] = 'Enter your Name|var a=prompt("Enter your Name:");showName(a)|Enter Name'
	arrM[10] = '<hr>'
	arrM[11] = 'Close this menu...|alert("This menu will be closed")|Close this Menu'

	GeneratePopupMenu(arrM, '', '')

	function showName(a)
	{
		//This function will be called from the Popup menu//
		alert('Hello' + a);
	}
	[/script]
 [/body]
***************************************************************/
function GeneratePopupMenu(arrMenu, FontFace, FontSize)
{
	var strTemp = ''
	var A = new Array()

	if (FontFace.length == 0 || FontFace == '' || FontFace.toLowerCase() == 'default')
		FontFace = "Tahoma"

	if (FontSize.length == 0 || FontSize == 0 || FontSize == '' || FontSize.toLowerCase() == 'default')
		FontSize = "8"

	var line_step = ((FontSize * 16) / 8)

	document.write('<style>')
	document.write('#MainMenu {border-top: 1px solid #D4D0C8; border-left: 1px solid LightGrey; border-right: 1px solid Black; border-bottom: 1px solid Black; position: absolute; visibility: hidden}')
	document.write('.MenuItem {border-top: 1px solid White; border-left: 1px solid White; border-right: 1px solid Gray; border-bottom: 1px solid Gray; line-height: ' + line_step + 'px; padding-left: 15px; padding-right: 15px; font-family: ' + FontFace + '; font-size: ' + FontSize + 'pt; background-color: #D4D0C8}')
	document.write('</style>')

	strTemp = "<div id='MainMenu' bgcolor='#D4D0C8'>"
	strTemp = strTemp + "<table border='0' bgcolor='#D4D0C8' cellpadding='0' cellspacing='0' class='MenuItem' valign='top'>"

	for (var I = 0; I <= UBound(arrMenu); I++)
	{
		A = Split(arrMenu[I], "|")
		if (A[0].toLowerCase() != "<hr>")
		{
			strTemp = strTemp + "<tr><td valign='top' onmouseover='highlight()' onmouseout='lowlight()' style='cursor: hand' "
			strTemp = strTemp + " toolTip='" + A[0] + "'"
			strTemp = strTemp + " onClick='javascript:{HideMenu();" + A[1] + "}'>"
			strTemp = strTemp + A[2] + ""
			strTemp = strTemp + "</td></tr>"
		}
		else
		{
			strTemp = strTemp + "<tr><td style='height: 3px; cursor: normal'></td></tr>"
			strTemp = strTemp + "<tr><td bgcolor=gray style='height: 1px; cursor: normal'></td></tr>"
			strTemp = strTemp + "<tr><td bgcolor=white style='height: 1px; cursor: normal'></td></tr>"
			strTemp = strTemp + "<tr><td style='height: 3px; cursor: normal'></td></tr>"
		}
	}

	strTemp = strTemp + "</table></div>"

	document.write(strTemp)

	document.oncontextmenu = DisplayMenu
	if (document.all && window.print)
		document.body.onclick = HideMenu

	return true
}

function highlight()
{
	event.srcElement.style.background = "Navy" //<= change value to change background color
	event.srcElement.style.color = "White"     //<= change value to change fore color
	if (event.srcElement.toolTip != '')
		window.status = event.srcElement.toolTip
}

function lowlight()
{
	event.srcElement.style.backgroundColor = "#D4D0C8"
	event.srcElement.style.color = "Black"
	window.status = ''
}

function DisplayMenu()
{
	var rightedge = document.body.clientWidth - event.clientX
	var bottomedge = document.body.clientHeight - event.clientY

	if (rightedge < MainMenu.offsetWidth)
		MainMenu.style.left = document.body.scrollLeft + event.clientX - MainMenu.offsetWidth
	else
		MainMenu.style.left = document.body.scrollLeft + event.clientX

	if (bottomedge < MainMenu.offsetHeight)
		MainMenu.style.top = document.body.scrollTop + event.clientY - MainMenu.offsetHeight
	else
		MainMenu.style.top = document.body.scrollTop + event.clientY

	MainMenu.style.visibility = "visible"
	return false
}

function HideMenu()
{
	MainMenu.style.visibility = "hidden"
}

/**************************************************************
 IsDate: Returns a Boolean (true) if the date is true, false
         is not

 Parameters:
	- DateStr: String date in format (MM/DD/YYYY)

 Returns: Boolean
***************************************************************/
function IsDate(dateStr)
{
	// Checks for the following valid date formats:
	// MM/DD/YYYY   MM-DD-YYYY

	var datePat = /^(\d{1,2})(\/|-)(\d{1,2})\2(\d{4})$/;

	var matchArray = dateStr.match(datePat)
	if (matchArray == null)
		return false

	month = matchArray[1]
	day = matchArray[3]
	year = matchArray[4]
	if (month < 1 || month > 12)
		return false

	if (day < 1 || day > 31)
		return false

	if ((month==4 || month==6 || month==9 || month==11) && day==31)
		return false

	if (month == 2)
	{
		var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0))
		if (day>29 || (day==29 && !isleap))
			return false;
	}
	return true;
}

/**************************************************************
 CheckBoxes: Checks, unchecks or switch the values of the
             checkboxes in a form.

 Parameters:
    - f_form: String. Name of the Form <FORM...>
    - Start : Number: Checkbox to start with (0 to start from 
              the first one
    - Length: Number: How many checkboxes after the Start 
              you want to check, uncheck or switch
    - Method: Strign: c = Check, u = Uncheck, s = Switch

 Returns: None
***************************************************************/
function CheckBoxes(f_form, Start, Length, Method)
{
	var s_type = ''

	Method = Method.toLowerCase()

	if (Start == 0) {Start = 0} else {Start = Start - 1}
	if (Length == 0) {Length = f_form.elements.length}

	for (var i = Start; i < Start + Length; i++)
	{
		s_type = f_form.elements[i]
		if (s_type.type == 'checkbox')
		{
			if (Method == 'c')
				s_type.checked = true
			if (Method == 'u')
				s_type.checked = false
			if (Method == 's')
				s_type.checked = !s_type.checked
		}
	}

	return
}

/**************************************************************
 DateDiff: Returns the Difference between two dates in weeks,
           days, hours, minutes & seconds

 Parameters:
    - Date1: First Date
    - Date2: Second Data

 Returns: String containing the weeks, days, hours, minutes &
          seconds between the two dates.
***************************************************************/
function DateDiff(Date1, Date2)
{
	date1 = new Date();
	date2 = new Date();
	diff  = new Date();

	date1temp = new Date(Date1);
	date1.setTime(date1temp.getTime());
	date2temp = new Date(Date2);
	date2.setTime(date2temp.getTime());

	diff.setTime(Math.abs(date1.getTime() - date2.getTime()));
	timediff = diff.getTime();

	weeks = Math.floor(timediff / (1000 * 60 * 60 * 24 * 7));
	timediff -= weeks * (1000 * 60 * 60 * 24 * 7);

	days = Math.floor(timediff / (1000 * 60 * 60 * 24)); 
	timediff -= days * (1000 * 60 * 60 * 24);

	hours = Math.floor(timediff / (1000 * 60 * 60)); 
	timediff -= hours * (1000 * 60 * 60);

	mins = Math.floor(timediff / (1000 * 60)); 
	timediff -= mins * (1000 * 60);

	secs = Math.floor(timediff / 1000); 
	timediff -= secs * 1000;

	return (weeks + " weeks, " + days + " days, " + hours + " hours, " + mins + " minutes, and " + secs + " seconds");
}

/**************************************************************
 MinutesDiff: Returns the number of minutes between two dates.

 Parameters:
    - Date1: First date
    - Date2: Second data

 Returns: Number
***************************************************************/
function MinutesDiff(Date1, Date2)
{
	date1 = new Date();
	date2 = new Date();
	diff  = new Date();

	date1temp = new Date(Date1);
	date1.setTime(date1temp.getTime());

	date2temp = new Date(Date2);
	date2.setTime(date2temp.getTime());

	diff.setTime(Math.abs(date1.getTime() - date2.getTime()));
	timediff = diff.getTime();

	weeks = Math.floor(timediff / (1000 * 60 * 60 * 24 * 7));
	timediff -= weeks * (1000 * 60 * 60 * 24 * 7);

	days = Math.floor(timediff / (1000 * 60 * 60 * 24)); 
	timediff -= days * (1000 * 60 * 60 * 24);

	hours = Math.floor(timediff / (1000 * 60 * 60)); 
	timediff -= hours * (1000 * 60 * 60);

	mins = Math.floor(timediff / (1000 * 60)); 
	timediff -= mins * (1000 * 60);

	secs = Math.floor(timediff / 1000); 
	timediff -= secs * 1000;

	return (mins + (hours * 60) + (days * 24 * 60) + (weeks * 7 * 24 * 60))
}



/**************************************************************
                               Tips
 **************************************************************/

/*
 - Want to keep a window in top of other? 
   use: <body onblur="self.focus()"> on the window you want to
        keep in top

 - Want to make a textbox read only?
   use: <INPUT TYPE="text" NAME="output" SIZE="30" onFocus="this.blur()">

 - Want to highlight the whole textbox or textarea box?
   use: <INPUT TYPE="text" NAME="output" SIZE="30" onFocus="this.select();">
*/