// based on the Inflector class found on a DZone snippet contributed by Todd Sayre
// http://snippets.dzone.com/posts/show/3205

MVC.Inflector = {
  Inflections: {
    plural: [
    [/(quiz)$/i,               "$1zes"  ],
    [/^(ox)$/i,                "$1en"   ],
    [/([m|l])ouse$/i,          "$1ice"  ],
    [/(matr|vert|ind)ix|ex$/i, "$1ices" ],
    [/(x|ch|ss|sh)$/i,         "$1es"   ],
    [/([^aeiouy]|qu)y$/i,      "$1ies"  ],
    [/(hive)$/i,               "$1s"    ],
    [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"],
    [/sis$/i,                  "ses"    ],
    [/([ti])um$/i,             "$1a"    ],
    [/(buffal|tomat)o$/i,      "$1oes"  ],
    [/(bu)s$/i,                "$1ses"  ],
    [/(alias|status)$/i,       "$1es"   ],
    [/(octop|vir)us$/i,        "$1i"    ],
    [/(ax|test)is$/i,          "$1es"   ],
    [/s$/i,                    "s"      ],
    [/$/,                      "s"      ]
    ],
    singular: [
    [/(quiz)zes$/i,                                                    "$1"     ],
    [/(matr)ices$/i,                                                   "$1ix"   ],
    [/(vert|ind)ices$/i,                                               "$1ex"   ],
    [/^(ox)en/i,                                                       "$1"     ],
    [/(alias|status)es$/i,                                             "$1"     ],
    [/(octop|vir)i$/i,                                                 "$1us"   ],
    [/(cris|ax|test)es$/i,                                             "$1is"   ],
    [/(shoe)s$/i,                                                      "$1"     ],
    [/(o)es$/i,                                                        "$1"     ],
    [/(bus)es$/i,                                                      "$1"     ],
    [/([m|l])ice$/i,                                                   "$1ouse" ],
    [/(x|ch|ss|sh)es$/i,                                               "$1"     ],
    [/(m)ovies$/i,                                                     "$1ovie" ],
    [/(s)eries$/i,                                                     "$1eries"],
    [/([^aeiouy]|qu)ies$/i,                                            "$1y"    ],
    [/([lr])ves$/i,                                                    "$1f"    ],
    [/(tive)s$/i,                                                      "$1"     ],
    [/(hive)s$/i,                                                      "$1"     ],
    [/([^f])ves$/i,                                                    "$1fe"   ],
    [/(^analy)ses$/i,                                                  "$1sis"  ],
    [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, "$1$2sis"],
    [/([ti])a$/i,                                                      "$1um"   ],
    [/(n)ews$/i,                                                       "$1ews"  ],
    [/s$/i,                                                            ""       ]
    ],
    irregular: [
    ['move',   'moves'   ],
    ['sex',    'sexes'   ],
    ['child',  'children'],
    ['man',    'men'     ],
    ['foreman', 'foremen'],
    ['person', 'people'  ]
    ],
    uncountable: [
    "sheep",
    "fish",
    "series",
    "species",
    "money",
    "rice",
    "information",
    "equipment"
    ]
  },
  pluralize: function(word) {
    for (var i = 0; i < MVC.Inflector.Inflections.uncountable.length; i++) {
      var uncountable = MVC.Inflector.Inflections.uncountable[i];
      if (word.toLowerCase() == uncountable) {
        return uncountable;
      }
    }
    for (var i = 0; i < MVC.Inflector.Inflections.irregular.length; i++) {
      var singular = MVC.Inflector.Inflections.irregular[i][0];
      var plural   = MVC.Inflector.Inflections.irregular[i][1];
      if ((word.toLowerCase() == singular) || (word == plural)) {
        return word.substring(0,1)+plural.substring(1);
      }
    }
    for (var i = 0; i < MVC.Inflector.Inflections.plural.length; i++) {
      var regex          = MVC.Inflector.Inflections.plural[i][0];
      var replace_string = MVC.Inflector.Inflections.plural[i][1];
      if (regex.test(word)) {
        return word.replace(regex, replace_string);
      }
    }
  },
  singularize: function(word) {
    for (var i = 0; i < MVC.Inflector.Inflections.uncountable.length; i++) {
      var uncountable = MVC.Inflector.Inflections.uncountable[i];
      if (word.toLowerCase() == uncountable) {
        return uncountable;
      }
    }
    for (var i = 0; i < MVC.Inflector.Inflections.irregular.length; i++) {
      var singular = MVC.Inflector.Inflections.irregular[i][0];
      var plural   = MVC.Inflector.Inflections.irregular[i][1];
      if ((word.toLowerCase() == singular) || (word.toLowerCase() == plural)) {
        return word.substring(0,1)+singular.substring(1);
      }
    }
    for (var i = 0; i < MVC.Inflector.Inflections.singular.length; i++) {
      var regex          = MVC.Inflector.Inflections.singular[i][0];
      var replace_string = MVC.Inflector.Inflections.singular[i][1];
      if (regex.test(word)) {
        return word.replace(regex, replace_string);
      }
    }
  }
};
/**
 *  @add  MVC.Native.String  Static
 */
MVC.Native.extend('String', {
  /**
   * Pluralizes a string
   * @plugin lang/inflector
   * @param {String} string string to be pluralized
   * @param {optional:Number} count
   * @param {optional:String} plural
   * @return {String}
   */
  pluralize: function(string, count, plural) {
    if (typeof count == 'undefined') {
      return MVC.Inflector.pluralize(string);
    } else {
      return count + ' ' + (1 == parseInt(count) ? string : plural || MVC.Inflector.pluralize(string));
    }
  },
  /**
   * Returns the singular version of a string
   * @plugin lang/inflector
   * @param {String} string the string to be singularized
   * @param {optional:Number} count
   * @return {String}
   */
  singularize: function(string, count) {
    if (typeof count == 'undefined') {
      return MVC.Inflector.singularize(string);
    } else {
      return count + " " + MVC.Inflector.singularize(string);
    }
  },
  /**
   * Returns if the string is singular
   * @plugin lang/inflector
   * @param {String} string
   * @return {Boolean}
   */
  is_singular: function(string){
    if(MVC.String.singularize(string) == null && string)
        return true;
    return false;
  }
});