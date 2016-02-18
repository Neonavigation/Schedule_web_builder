var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

Mustache.escape = function escapeHtml (string) {
  if (typeof string !== 'string') string = JSON.stringify(string);
  return string.replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
    return entityMap[s];
  });
}

function TemplatesHelper($) {
  var self = this
  var loading_templ = 0;
  var loaded_templates = {};

  function load_templ(tn) {
    $.get('mustache/' + tn + '.mustache', function(templ) {
      loaded_templates[tn] = templ;
      loading_templ --;
    });
  }
  for (t in window.mustache_list) {
    loading_templ ++;
    load_templ(window.mustache_list[t])
  }

  var crossLoad;

  function addUrlParameters(url, params) {
    var li = url.lastIndexOf("?")
    if (li > 0) {
      var splits = url.substring(li + 1).split('&')
      for (s in splits) {
        var new_p = splits[s].split('=')
        if (params[new_p[0]] === undefined) {
          params[new_p[0]] = new_p[1]
        }
      }
      url = url.substring(0, li) + '?'
    } else url += '?'
    var first = true
    for (p in params) {
      var p_add = p + '=' + params[p]
      if (!first) p_add = '&' + p_add;
      url += p_add
      first = false
    }
    if (params.length == 0) {
      url = url.substring(0, url.length - 1);
    }
    //console.log(url)
    return url;
  }


  if (window.devMode) {
    self.getHtml = function(url, params, templ_name, callBack) {
      var func = function(url, params, templ_name) {
        var template = loaded_templates[templ_name]
        if (template) {
          var partials = {};
          for (t in window.mustache_list) {
            if (window.mustache_list[t] !== templ_name) {
              partials[window.mustache_list[t]] = loaded_templates[window.mustache_list[t]]
            }
          }
          $.get(nexpo.apiURL + addUrlParameters(url, params), function(data){
            //console.log(data)
            var json = eval('('+data+')')
            json['the_host'] = nexpo.apiURL;
            var html = Mustache.render(template, json, partials);
            callBack(html)
          });
          /*
          crossLoadJson(addUrlParameters(url, params), function(json) {
            console.log('aaa')
            json['obj_r'] = function() {
              return JSON.stringify(this)
            }
            var html = Mustache.render(template, json, partials);
            callBack(html)
          });
*/
        }
      }
      var toFunc = function() {
        //console.log(loading_templ)
        if (loading_templ == 0) func(url, params, templ_name);
        else {
          window.setTimeout(function() {
            toFunc();
          }, 100);
        }
      }
      toFunc()
    }
  } else {
    self.getHtml = function(url, params) {
      while (loading_templ != 0) {

      };
      console.log(url, params)
      crossLoadData(url, function(data) {
        console.log(data)
      });
    }
  }
}