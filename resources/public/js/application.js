nexpo.apiURL = nexpo.prot + '//nexpo.me';
window.devMode = true;
window.ModuleLoader([],[], function() {
    (function($) {

        function Application() {

            var th = new TemplatesHelper($);
            th.getHtml('/location/XTJA2EXBED/rest/schedulehtmlpub/ru', {'init': true}, 'schedulewrap', function(html) {

                $('body').html(html);

                var tabs = new moduleTabs();
                //выделяем первую вкладку
                tabs.init(0);

                var popups = new modulePopups();
                popups.init();

                //var scroll = new moduleScroll();

            });

            function moduleTabs(){
                var self = this;

                self.day_halls = {};

                self.config = {
                    tabs: $('.tabs .item'),
                    tabs_halls_selected: function(){
                        return $('.schedule-tabs .item.selected')
                    },

                    day: function(){
                        return $('.tabs .selected').data('day').toString();
                    },
                    /*
                    available_days: function(obj){
                        var obj = obj || $(".schedule-tabs");
                        return $(obj).data("available-days");
                    },
                    hasImportant: function(){
                        return $('.schedule-tabs .important').length;
                    },
                    */
                    fr_names: function(){
                        return $(".schedule-tabs .selected").data('hall_fr_names');
                    },
                    all_halls: function(){
                        return $(".schedule-container").data('all_halls');
                    }
                };

                self.rememberDayHalls = function() {
                    var hall_fr_names = self.config.fr_names();
                    var all_halls = self.config.all_halls();
                    var halls = [];
                    for(var i in hall_fr_names){
                        for (var j in all_halls){
                            if (all_halls[j].fr_name === hall_fr_names[i]) {
                                halls.push({hall_name: all_halls[j].hall_name, pav_id: all_halls[j].pav_id});
                            }
                        }
                    }
                    self.day_halls[self.config.day()] = halls;
                }

                self.init = function(index){
                    //берется первый таб, если иной явно не передан
                    index = index || 0;
                    self.config.tabs.eq(index).addClass('selected');
                    //визуализация disabled/enabled для групп
                    self.viewTabs();
                    //Выделение первой доступной группы залов
                    /*
                    $('.schedule-tabs').each(function(){
                        $(this).find('.enabled').first().addClass('selected');
                    });
*/
                    //Обработчики событий
                    self.events();

                    self.rememberDayHalls();
                };


                self.viewTabs = function(){
                    /*
                    $('.schedule-tabs').each(function(){
                        $(this).find('.item').removeClass("selected");//.removeClass("enabled disabled selected");
                    });
                    */

                    /*
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
                    */
                    if($('.schedule-tabs .item').length==1){
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
                    if (!hall_fr_names) {
                        var currentDayHalls = self.day_halls[self.config.day()];
                        if (currentDayHalls && currentDayHalls.length) {
                            halls = currentDayHalls;
                        }
                    }
                    if (halls.length == 0) {
                        var all_halls = self.config.all_halls();
                        for(var i in hall_fr_names){
                            for (var j in all_halls){
                                if (all_halls[j].fr_name === hall_fr_names[i]) {
                                    halls.push({hall_name: all_halls[j].hall_name, pav_id: all_halls[j].pav_id});
                                }
                            }
                        }
                    }
                    th.getHtml('/location/XTJA2EXBED/rest/schedulehtmlpub/ru', {'pph': 100, 'day': self.config.day(), halls: JSON.stringify(halls)}, 'table', function(html) {
                        $('.schedule-container').html(html);

                        self.rememberDayHalls();
                    });
                };

                self.events = function(){
                    $('body').on('click', '.tabs .item', function(){
                        //отображение выделения основного таба
                        self.config.tabs.removeClass('selected');
                        var selected = self.config.tabs_halls_selected();
                        selected.removeClass('selected');
                        $(this).addClass('selected');
                        //отображение групп залов disabled/enabled
                        self.viewTabs();

                        /*
                        //проверка, если пользователь выбрал группу залов явно
                        if(self.config.hasImportant()){
                            //Проверка существования выставки в выбранный день в выбранной группе залов
                            if(self.config.available_days().indexOf(self.config.day())!==-1){
                                //если явная группа залов доступна, отображаем выделение
                                $('.schedule-tabs').each(function(){
                                    $(this).find('.important').addClass("selected");
                                });
                            } else {
                                //если явная группа залов не доступна в этот день, отображаем выделение первой доступной
                                $('.schedule-tabs').each(function(){
                                    $(this).find('.enabled').first().addClass("selected");
                                });
                            }
                        } else {
                            //Если явно группа залов не выбрана, выделяем первую доступную
                            $('.schedule-tabs').each(function(){
                                $(this).find('.enabled').first().addClass('selected');
                            });
                        }
                        */
                        //отображаем таблицу с новыми данными
                        self.getTable();
                        selected.addClass('selected');
                    });
                    $('body').on('click', '.schedule-tabs .item', function(){
                        var schedule_tabs = $(this).closest('.schedule-tabs');
                        var index = $(this).index();
                        //обрабатываем клики только на доступных группах
                        if($(this).hasClass('enabled')){
                            $('.schedule-tabs').each(function(){
                                $(this).find('.item').removeClass('selected');
                                $(this).find('.item').eq(index).addClass('selected');
                            });

                            self.getTable();
                        }
                        return false;
                    });
                };

            }

            function modulePopups(){
                var self = this;

                self.init = function(){
                    self.events();
                };

                self.events = function(){
                    $('body').on('click', '.js-data-block', function(){
                        $('.description-popup').css('display','block');
                        th.getHtml('/location/XTJA2EXBED/rest/eventhtmlpub/ru', {'evid': $(this).data('id')}, 'popup', function(html) {
                            $('.description-popup .popup').html(html);
                            $('.description-popup').addClass('fade-in');


                            /*
                            $('.description-popup .popup-content').mCustomScrollbar({
                                axis:"y" // horizontal scrollbar
                            });
*/
                        });
                    });
                    $('body').on('click', '.js-close-popup', function(){
                        $('.description-popup').removeClass('fade-in');
                        setTimeout(function(){
                            $('.description-popup').css('display','none');
                        },400);
                    });
                };
            }

/*
            function moduleScroll(){

                var self = this;
                //var window = $(window);
                var $dragging = null;
                var body = $('body');

                $( '.scrollable' )
                    .on( 'mousewheel DOMMouseScroll', function (event) {
                        var e = event.originalEvent,
                            delta = e.wheelDelta || -e.detail;
                        this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                        event.preventDefault();
                    })
                    .on('scroll', function(){
                        var scroll = $('.scroll');
                        var k = $('.scrollable').scrollTop()/($('.scrollable .scrollable-wrapper').height()-$('.scrollable').height());
                        scroll.css({
                            'top': 100*k+'%',
                            'margin-top': -300*k+'px'
                        });
                    });

            }
            */

        }


        var app = new Application();


    })(window.mweb_jq)
});