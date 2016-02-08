nexpo.apiURL = nexpo.prot + '//nexpo.me';
window.devMode = true;
window.ModuleLoader([],[], function() {
    (function($) {

        function Application() {

            var th = new TemplatesHelper($);
            th.getHtml('/location/1XPNP1WZVQ/rest/schedulehtmlpub/ru', {'init': true}, 'schedulewrap', function(html) {
                $('body').html(html);
                var tabs = new moduleTabs();
                tabs.init(0);
            });

            function moduleTabs(){

                var self = this;

                self.config = {
                    tabs: $('.tabs .item'),
                    tabs_halls: $('.schedule-tabs .item'),

                    day: function(){
                        return $('.tabs .selected').data('day').toString();
                    },
                    available_days: function(obj){
                        var obj = obj || $(".schedule-tabs .important");
                        return $(obj).data("available-days").toString().split(",");
                    },
                    hasImportant: function(){
                        return $('.schedule-tabs .important').length;
                    },
                    fr_names: function(){
                        return $(".schedule-tabs .selected").data('hall_fr_names');
                    }
                };

                self.init = function(index){
                    //������� ������ ���, ���� ���� ���� �� �������
                    index = index || 0;
                    self.config.tabs.eq(index).addClass('selected');
                    //������������ disabled/enabled ��� �����
                    self.viewTabs();
                    //��������� ������ ��������� ������ �����
                    $('.schedule-tabs').each(function(){
                        $(this).find('.enabled').first().addClass('selected');
                    });
                    //����������� �������
                    self.events();
                };


                self.viewTabs = function(){
                    $('.schedule-tabs').each(function(){
                        $(this).find('.item').removeClass("enabled disabled selected");
                    });
                    $('.schedule-tabs').each(function(){
                        var schedule_tabs = $(this);
                        schedule_tabs.find('.item').each(function(j){
                            if(self.config.available_days(this).indexOf(self.config.day())!==-1) {
                                schedule_tabs.find('.item').eq(j).addClass("enabled");
                            } else {
                                schedule_tabs.find('.item').eq(j).addClass("disabled");
                            }
                        });
                    })
                    if($('.schedule-tabs .enabled').length==1){
                        $('.schedule-tabs').each(function(){
                            $(this).hide();
                        });
                    } else {
                        $('.schedule-tabs').each(function(){
                            $(this).show();
                        });
                    }
                };

                self.getTable = function(){
                    var hall_fr_names = self.config.fr_names();
                    var halls = [];
                    for(var i in hall_fr_names){
                        halls.push({hall_name: hall_fr_names[i], pav_id: ""});
                    }
                    console.log(hall_fr_names.length);
                    th.getHtml('/location/1XPNP1WZVQ/rest/schedulehtmlpub/ru', {'pph': 100, 'day': self.config.day(), halls: JSON.stringify(halls)}, 'table', function(html) {
                        $('.schedule-table').replaceWith(html);
                    });
                };

                self.events = function(){
                    $('body').on('click', '.tabs .item', function(){
                        //����������� ��������� ��������� ����
                        self.config.tabs.removeClass('selected');
                        $(this).addClass('selected');
                        //����������� ����� ����� disabled/enabled
                        self.viewTabs();
                        //��������, ���� ������������ ������ ������ ����� ����
                        if(self.config.hasImportant()){
                            //�������� ������������� �������� � ��������� ���� � ��������� ������ �����
                            if(self.config.available_days().indexOf(self.config.day())!==-1){
                                //���� ����� ������ ����� ��������, ���������� ���������
                                $('.schedule-tabs').each(function(){
                                    $(this).find('.important').addClass("selected");
                                });
                            } else {
                                //���� ����� ������ ����� �� �������� � ���� ����, ���������� ��������� ������ ���������
                                $('.schedule-tabs').each(function(){
                                    $(this).find('.enabled').first().addClass("selected");
                                });
                            }
                        } else {
                            //���� ���� ������ ����� �� �������, �������� ������ ���������
                            $('.schedule-tabs').each(function(){
                                $(this).find('.enabled').first().addClass('selected');
                            });
                        }
                        //���������� ������� � ������ �������
                        self.getTable();
                    });
                    $('body').on('click', '.schedule-tabs .item', function(){
                        var schedule_tabs = $(this).closest('.schedule-tabs');
                        var index = $(this).index();
                        //������������ ����� ������ �� ��������� �������
                        if($(this).hasClass('enabled')){
                            $('.schedule-tabs').each(function(){
                                $(this).find('.item').removeClass('important selected');
                                $(this).find('.item').eq(index).addClass('important selected');
                            });

                            self.getTable();
                        }
                        return false;
                    });
                };

            }



        }


        var app = new Application();


    })(window.mweb_jq)
});