<?php
/*
Copyright (C) 2014 by WebCreative5 - Samuel Ronce

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
Require PHP >= 5.3
	
Code : 
	
	include("Languages.php");

	Languages::init(array("fr", "en", jp"), "languages/");
	echo t("TEST");
	echo t("TEST", 3);
*/
class Languages {
	
	public 	static $current = "en",
			$data = array(),
			$options = array();
			
	public static function init($id, $path = null) {
		
		if (is_array($id)) {
			$user_lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
			if (in_array($user_lang, $id)) {
				$id = $user_lang;
			}
			else {
				$id = $id[0];
			}
		}
		
		if (!isset($path)) $path = "./languages/";
		
		$json = json_decode(file_get_contents( $path . $id . ".json"), true);
		
		self::$current = $id;
		self::$data = $json[0];
		self::$options = $json[1];
	}
	
	public static function get($id) {
		return isset(self::$data[$id]) ? self::$data[$id] : "";
	}
	
	public static function getPlurial($val, $type) {
		$val = abs($val);
		if (!preg_match('#[0-9]+#', $val)) {
			return false;
		}
		$plurial = self::$options["plurial"][$type];
		if (!isset($plurial)) {
			$plurial = array("s");
		}
		if ($val >= 2 && isset($plurial[$val])) {
			return $plurial[$val];
		}
		else if ($val > 1) {
			return $plurial[0];
		}
		else {
			return isset($plurial[1]) ? $plurial[1] : "";
		}
	}
	
	public static function format($str) {
	
		$args = func_get_args();
		array_shift($args);
		$i = -1;
		
		if (!preg_match_all("#%[sdp]#", $str, $match)) {
			return $str;
		}
		
		for ($j=0 ; $j < count($match[0]) ; $j++) {
			$i++;
			$m = $match[0][$j];
			if ($m == "%d") {
				 $plurial = isset($args[$i]) ? $args[$i] : 0;
			}
		}
		
		$i = -1;
		
		return preg_replace_callback("#%[sdp]([0-9]+)?#", function ($match) use ($i, $args, $plurial) {
		  $i++;
		  $val = isset($args[$i]) ? $args[$i] : $match[0];
		 
		  if (preg_match("#^%p#", $match[0])) {
			 if (!isset($plurial)) {
				$plurial = $val;
			 }
			 $val = Languages::getPlurial($plurial, str_replace("%", "", $match[0]));
		  }
		  
		  return $val;
		}, $str);
	}
}

function t($txt, $arg = null) {
	
	$str = "";
	$_args = func_get_args();
	array_shift($_args);
	
	if (is_bool($arg)) {
		$type = explode("|", $txt);
		$txt = $arg ? $type[0] : $type[1];
		array_shift($_args);
	}

	$words = explode(" ", $txt);
	for ($i=0 ; $i < count($words) ; $i++) {
		$w = $words[$i];
		$word = Languages::get($w);
		if (isset($word)) {
			$arguments = $_args;
			array_unshift($arguments, $word);
			$str .= call_user_func_array(array("Languages", 'format'), $arguments);
		}
		
	}	
	return $str;
}
?>