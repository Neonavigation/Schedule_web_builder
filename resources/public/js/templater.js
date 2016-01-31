function TemplatesHelper($) {
  var self = this
  var loading_templ = 0;
  var loaded_templates = {};

  function load_templ(tn) {
    $.get('/mustache/' + tn + '.mustache', function(templ) {
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
          crossLoadJson(addUrlParameters(url, params), function(json) {
            console.log(json)
            var html = Mustache.render(template, json, partials);
            callBack(html)
          });
        }
      }
      var toFunc = function() {
        console.log(loading_templ)
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