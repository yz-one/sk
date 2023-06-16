// $j(document).ready(function(){
//     uiLayerPopup();
//     uiTab();
// });
var $j = jQuery;

// layer-popup
function uiLayerPopup() {
    // 기본 열기 닫기
    $j('.ui-layer-popup-call').on('click', function(){
        var openLayer = $j(this).attr('data-target');
        $j(openLayer).addClass('active');
        $j(openLayer).attr('aria-modal', true);
    });
    $j('.ui-layer-popup .btn-close').on('click', function(){
        var openLayer = $j(this).closest('.ui-layer-popup').attr('id');
        $j('#' + openLayer).removeClass('active');
        $j('#' + openLayer).attr('aria-modal', false);
    });

    // 외부영역 클릭 시 팝업 닫기
    $j(document).mouseup(function(e) {
        var layerPopup = $j('.dim-close.ui-layer-popup.active:first');
        if(layerPopup.has(e.target).length === 0) {
            layerPopup.removeClass('active');
        }
    });
}

// 오늘 하루 열지 않기
function notodayPopup() {
    /* 팝업 id 찾기 */

    // 해당 레이어 팝업이 존재하는 경우
    if ($j('.ui-layer-popup.ui-notoday-popup').length > 0) {
        // 반복문 돌면서 처리
        for (var i = 0; i < $j('.ui-layer-popup.ui-notoday-popup').length ;i++ ) {
            var todayId = $j('.ui-layer-popup.ui-notoday-popup').eq(i).attr('id');
            /* 스토리지 제어 함수 정의 */
            var handleStorage = {
                // 스토리지에 데이터 쓰기(이름, 만료일)
                setStorage: function (name, exp) {
                    // 만료 시간 구하기(exp를 ms단위로 변경)
                    var date = new Date();
                    date = date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);

                    // 로컬 스토리지에 저장하기
                    // (값을 따로 저장하지 않고 만료 시간을 저장)
                    localStorage.setItem(name, date)
                },
                // 스토리지 읽어오기
                getStorage: function (name) {
                    var now = new Date();
                    now = now.setTime(now.getTime());
                    // 현재 시각과 스토리지에 저장된 시각을 각각 비교하여
                    // 시간이 남아 있으면 true, 아니면 false 리턴
                    return parseInt(localStorage.getItem(name)) > now
                }
            };

            // 쿠키 읽고 화면 보이게
            if (handleStorage.getStorage(todayId)) {
                $j("#"+todayId).removeClass("active");
            } else {
                $j("#"+todayId).addClass("active");
            }
        }

        // 오늘하루 보지 않기 버튼
        $j('.ui-notoday .btn-today-close').on("click", function () {
            var todayId = ($j(this).parents(".ui-layer-popup.ui-notoday-popup").attr("id"));
            // 로컬 스토리지에 today라는 이름으로 1일(24시간 뒤) 동안 보이지 않게
            if ($j('#'+todayId+' .ui-notoday input[type=checkbox]').is(':checked')) {
                handleStorage.setStorage(todayId, 1);
            }
            $j("#"+todayId+".active").removeClass("active");
        });
    }
}
$(function () {
    notodayPopup();
});

// tab
function uiTab() {
    $j('.ui-tab-nav button').on('click', function(){
        var navIdx = $j(this).parent().children('.ui-tab-nav button').index(this);
        $j(this).parent().children('.ui-tab-nav button').removeClass('active');
        $j(this).parent().next().find('> div[class^="ui-tab-content"]').removeClass('active');
        $j(this).addClass('active');
        $j(this).parent().next().find('> div[class^="ui-tab-content"]').eq(navIdx).addClass('active');
    });
}

// accordion
function uiAccordion() {
    $j('.ui-accordion .ui-accordion-btn').on('click', function(){
        var uiAcc = $j(this).closest('.ui-accordion');
        var uiAccChild = uiAcc.children('.ui-accordion-item');
        if (uiAcc.hasClass('multi-open')) {
            $j(this).parent().toggleClass('active');
        } else {
            if ($j(this).parent().hasClass('active')) {
                $j(this).parent().removeClass('active');
            } else {
                uiAccChild.removeClass('active');
                $j(this).parent().addClass('active');
            }
        }
    });
}

// fixed menu
function fixedMenu(cssTop) {
    $j('.ui-fixed-menu').css('height', $j('.ui-fixed-menu .inner').outerHeight());
    fixedMenuScroll(cssTop);
    clickScroll(cssTop);
    $j(window).on('scroll', function() {
        fixedMenuScroll(cssTop);
    });
}
function fixedMenuScroll(cssTop) {
    var scrollTop = $j(this).scrollTop();
    var headerHeight = $j('header').outerHeight();
    if (typeof cssTop == "undefined") {
        if (scrollTop >= headerHeight) {
            $j('.ui-fixed-menu').addClass('position-fixed');
            $j('.ui-fixed-menu').css('top','');
        } else {
            $j('.ui-fixed-menu').removeClass('position-fixed');
        }
    } else {
        if (scrollTop >= headerHeight-cssTop) {
            $j('.ui-fixed-menu').addClass('position-fixed');
            $j('.ui-fixed-menu').css('top',cssTop);
        } else {
            $j('.ui-fixed-menu').removeClass('position-fixed');
            $j('.ui-fixed-menu').css('top','');
        }
    }
}
function clickScroll(cssTop) {
    var navBtns = $j('.ui-fixed-menu nav').children();
    navBtns.on('click', function(){
        var menuHeight = $j('.ui-fixed-menu').outerHeight() + cssTop;
        console.log(menuHeight);
        var navBtnsIdx = $j(this).index() + 1;
        var offset = $j(".section" + navBtnsIdx).offset();
        $j('html, body').animate({scrollTop : offset.top - menuHeight}, 200);
    });
}

// GNB
$j(window).on('load', function(){
    uiTab();
    uiLayerPopup();
    $j('.menu-all-content-common > .ui-tab-nav > button').on('click', function(){
        var gnbId = $j(this).attr('id');
        $j(this).parents('.menu-all-content-common').attr({'id': gnbId});
    });

    $j('#gnb .menu-all').hover(function(){
        $j('header').addClass('active');
    }, function() {
        $j('header').removeClass('active');
    });

    // $j('#gnb .menu-all').on('mouseenter', function(){
    //     $j('header').toggleClass('active');
    // });
    // $j('#gnb .menu-all').on('mouseleave', function(){
    //     $j('header').toggleClass('active');
    // });
    $j('header .personal-wrap').on('mouseenter', function(){
        $j('header .header-top').css({zIndex: 130});
    });
    $j('header .personal-wrap').on('mouseleave', function(){
        $j('header .header-top').css({zIndex: ''});
    });
});

// slide set
// 메인 슬라이더
function mainSlider() {
    var mainSwiper = new Swiper("#main-slider .swiper-container", {
        effect : 'fade',
		direction: 'vertical',
        autoplay: {
            delay: 2500,
        },
        loop: false,
        speed : 1000,
        pagination: {
            el: "#main-slider .button-group .pagination",
            type: "fraction",
        },
    });

    // 좌우 버튼 컨트롤
    var totalSlide = $j('#main-slider .swiper-slide').length;
    $j('#main-slider .button-group .swiper-toggle').on('click', function () {
        swiperAutoplayToggle(mainSwiper);
    });
    $j('#main-slider .button-group .swiper-next').on('click', function () {
        var myIndex = mainSwiper.realIndex + 1;
        if(myIndex == totalSlide) {
            mainSwiper.slideTo(0);
            mainSwiper.autoplay.start();
        } else {
            mainSwiper.slideNext();
            mainSwiper.autoplay.start();
        }
    });
    $j('#main-slider .button-group .swiper-prev').on('click', function () {
        var myIndex = mainSwiper.realIndex + 1;
        if(myIndex == 1) {
            mainSwiper.slideTo(totalSlide);
            mainSwiper.autoplay.start();
        } else {
            mainSwiper.slidePrev();
            mainSwiper.autoplay.start();
        }
    });
}

// 오토 플레이 토글
function swiperAutoplayToggle(swiperName) {
    var autoPlayToggle = swiperName.autoplay.running;
    if (autoPlayToggle == true) {
        swiperName.autoplay.stop();
        $j('#main-slider .button-group .swiper-toggle').addClass('stop');
    } else {
        swiperName.autoplay.start();
        $j('#main-slider .button-group .swiper-toggle').removeClass('stop');
    }
}