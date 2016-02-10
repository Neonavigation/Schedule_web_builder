nexpo.apiURL = nexpo.prot + '//nexpo.me';
window.devMode = true;
window.ModuleLoader([],[], function() {
    (function($) {

        function Application() {

            var th = new TemplatesHelper($);
            th.getHtml('/location/1XPNP1WZVQ/rest/schedulehtmlpub/ru', {'init': true}, 'schedulewrap', function(html) {

                $('body').html(html);

                var tabs = new moduleTabs();
                //выделяем первую вкладку
                tabs.init(0);

                var popups = new modulePopups();
                popups.init();

                var scroll = new moduleScroll();

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
                    //берется первый таб, если иной явно не передан
                    index = index || 0;
                    self.config.tabs.eq(index).addClass('selected');
                    //визуализация disabled/enabled для групп
                    self.viewTabs();
                    //Выделение первой доступной группы залов
                    $('.schedule-tabs').each(function(){
                        $(this).find('.enabled').first().addClass('selected');
                    });
                    //Обработчики событий
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
                        //отображение выделения основного таба
                        self.config.tabs.removeClass('selected');
                        $(this).addClass('selected');
                        //отображение групп залов disabled/enabled
                        self.viewTabs();
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
                        //отображаем таблицу с новыми данными
                        self.getTable();
                    });
                    $('body').on('click', '.schedule-tabs .item', function(){
                        var schedule_tabs = $(this).closest('.schedule-tabs');
                        var index = $(this).index();
                        //обрабатываем клики только на доступных группах
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

            function modulePopups(){
                var self = this;

                self.init = function(){
                    self.events();
                };

                self.events = function(){
                    $('body').on('click', '.js-data-block', function(){
                        $('.description-popup').css('display','block');
                        setTimeout(function(){
                            $('.description-popup').addClass('fade-in');
                        },10);
                    });
                    $('body').on('click', '.js-close-popup', function(){
                        $('.description-popup').removeClass('fade-in');
                        setTimeout(function(){
                            $('.description-popup').css('display','none');
                        },400);
                    });
                };
            }

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

                /*
                self.scrollable = function(Y){
                    var k = (Y-300)/($('.scrollable').height()-200);
                    var scroll_height = $('.scrollable')[0].scrollHeight-$('.scrollable').height();
                    console.log(scroll_height);
                    $('.scrollable').scrollTop(scroll_height*k);
                };

                $('.scroll, .bar')
                    .on('mousedown', function(event){

                        $dragging = $(event.target);

                        self.scrollable(event.pageY);
                        body
                            .on('mousemove', function(event){
                                if($dragging){
                                    self.scrollable(event.pageY);
                                }
                            })
                            .on('mouseup mouseleave', function(event){
                                $dragging = null;
                            });

                    });
                */

            }

        }


        var app = new Application();


    })(window.mweb_jq)
});