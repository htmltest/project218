$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $.validator.addMethod('codeSMS',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\d{6}$/);
        },
        'Ошибка заполнения'
    );

    $('body').on('focus', '.form-input input, .form-input textarea', function() {
        $(this).parent().addClass('focus');
    });

    $('body').on('blur', '.form-input input, .form-input textarea', function() {
        $(this).parent().removeClass('focus');
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        } else {
            $(this).parent().removeClass('full');
        }
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        if (curLink.attr('href').substr(0, 1) == '#') {
            var curBlock = $(curLink.attr('href'));
            if (curBlock.length == 1) {
                windowOpenHTML(curBlock.html());
            }
        } else {
            windowOpen(curLink.attr('href'));
        }
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close, .window-close-btn', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.mobile-menu-link').click(function(e) {
        var curScroll = $(window).scrollTop();
        $('html').addClass('mobile-menu-open');
        $('html').data('scrollTop', curScroll);
        $('.wrapper').css('margin-top', -curScroll);
        e.preventDefault();
    });

    $('.mobile-menu-close').click(function(e) {
        $('html').removeClass('mobile-menu-open');
        $('.wrapper').css('margin-top', 0);
        $(window).scrollTop($('html').data('scrollTop'));
        e.preventDefault();
    });

    $('.nav > ul > li').each(function() {
        var curItem = $(this);
        if (curItem.find('.nav-sub').length == 1) {
            curItem.append('<span class="nav-mobile-sublink"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#nav-mobile-sublink"></use></svg></span>');
        }
    });

    $('body').on('click', '.nav-mobile-sublink', function() {
        $('html').toggleClass('mobile-submenu-open');
        $(this).parent().toggleClass('open');
    });

    $('.footer-menu > ul > li').each(function() {
        var curItem = $(this);
        if (curItem.find('ul').length == 1) {
            curItem.append('<span class="footer-menu-mobile-sublink"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#footer-mobile-sublink"></use></svg></span>');
        }
    });

    $('body').on('click', '.footer-menu-mobile-sublink', function() {
        $(this).parent().toggleClass('open');
    });

    $('.gallery').each(function() {
        var curSlider = $(this);
        curSlider.wrapInner('<div class="swiper-wrapper"></div>');
        curSlider.find('.gallery-item').addClass('swiper-slide');
        curSlider.append('<div class="swiper-pagination"></div><div class="swiper-button-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></div><div class="swiper-button-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></div>');
        const swiper = new Swiper(curSlider[0], {
            loop: true,
            touchAngle: 30,
            autoHeight: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            on: {
                afterInit: function () {
                    var curSlide = curSlider.find('.swiper-slide-active');
                    var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
                    curSlider.find('.swiper-pagination').css({'top': curPhotoHeight});
                    curSlider.find('.swiper-button-prev').css({'top': curPhotoHeight / 2});
                    curSlider.find('.swiper-button-next').css({'top': curPhotoHeight / 2});
                },
                slideChangeTransitionEnd: function () {
                    var curSlide = curSlider.find('.swiper-slide-active');
                    var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
                    curSlider.find('.swiper-pagination').css({'top': curPhotoHeight});
                    curSlider.find('.swiper-button-prev').css({'top': curPhotoHeight / 2});
                    curSlider.find('.swiper-button-next').css({'top': curPhotoHeight / 2});
                }
            }
        });
    });

    $('.footer-subscribe form').each(function() {
        var curForm = $(this);
        var validator = curForm.validate();
        if (validator) {
            validator.destroy();
        }
        curForm.validate({
            ignore: '',
            submitHandler: function(form) {
                var formData = new FormData(form);
                $.ajax({
                    type: 'POST',
                    url: curForm.attr('action'),
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    data: formData,
                    cache: false
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    curForm.find('label.error').remove();
                    curForm.find('.footer-subscribe-input').append('<label class="error">Сервис временно недоступен</label>');
                }).done(function(data) {
                    curForm.find('label.error').remove();
                    if (data.status) {
                        curForm.find('.footer-subscribe-input').append('<label class="error success">' + data.message + '</label>');
                    } else {
                        curForm.find('.footer-subscribe-input').append('<label class="error">' + data.message + '</label>');
                    }
                });
            }
        });
    });

    $('.slider').each(function() {
        var curSlider = $(this);
        curSlider.wrapInner('<div class="swiper-wrapper"></div>');
        curSlider.find('.slider-item').addClass('swiper-slide');
        curSlider.append('<div class="swiper-pagination"></div>');
        const swiper = new Swiper(curSlider[0], {
            loop: true,
            speed: 1000,
            touchAngle: 30,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            on: {
                afterInit: function () {
                    curSlider.find('.swiper-pagination-bullet-active').addClass('active');
                    if ($('.swiper-slide-active').hasClass('inverse')) {
                        $('header').addClass('inverse');
                    } else {
                        $('header').removeClass('inverse');
                    }
                },
                slideChangeTransitionStart: function () {
                    curSlider.find('.swiper-pagination-bullet.active').removeClass('active');
                    if ($('.swiper-slide-active').hasClass('inverse')) {
                        $('header').addClass('inverse');
                    } else {
                        $('header').removeClass('inverse');
                    }
                },
                slideChangeTransitionEnd: function () {
                    curSlider.find('.swiper-pagination-bullet-active').addClass('active');
                }
            }
        });
    });

    $('.main-catalogue .catalogue-list').each(function() {
        var curSlider = $(this);
        curSlider.wrapInner('<div class="swiper-wrapper"></div>');
        curSlider.find('.catalogue-item').addClass('swiper-slide');
        curSlider.append('<div class="swiper-button-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-prev"></use></svg></div><div class="swiper-button-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-next"></use></svg></div>');
        var curParent = curSlider.parents().filter('.main-catalogue');
        var countSlides = 4;
        if (curParent.hasClass('other-catalogue')) {
            countSlides = 6;
        }
        const swiper = new Swiper(curSlider[0], {
            touchAngle: 30,
            slidesPerView: 2,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                1232: {
                  slidesPerView: countSlides
                },
            }
        });
    });

    $('body').on('click', '.catalogue-item-favourite', function(e) {
        $(this).parents().filter('.catalogue-item').toggleClass('in-favourite');
        e.preventDefault();
    });

    $('.card-info-colors input').change(function() {
        var curChecked = $('.card-info-colors input:checked');
        $('.card-info-color-title').html(curChecked.attr('data-title'));
    });

    $('body').on('mouseenter', '.card-info-colors label', function() {
        var curChecked = $(this).find('input');
        $('.card-info-color-title').html(curChecked.attr('data-title'));
    });

    $('body').on('mouseleave', '.card-info-colors label', function() {
        var curChecked = $('.card-info-colors input:checked');
        $('.card-info-color-title').html(curChecked.attr('data-title'));
    });

    $('.card-info-colors').each(function() {
        var curChecked = $('.card-info-colors input:checked');
        $('.card-info-color-title').html(curChecked.attr('data-title'));
    });

    $('.card-info-favourite a').click(function(e) {
        $(this).parent().toggleClass('in-favourite');
        e.preventDefault();
    });

    $('.card-info-block-title').click(function(e) {
        var curTitle = $(this);
        var curBlock = curTitle.parent();
        curBlock.toggleClass('open');
        curBlock.find('.card-info-block-container').slideToggle(function() {
            $(window).trigger('scroll');
        });
        e.preventDefault();
    });

    $('body').on('click', '.window .window-table-list-row', function() {
        var curRow = $(this);
        $('.window .window-table-list-row.active').removeClass('active');
        $('.window .window-table-measurement.active').removeClass('active');
        curRow.addClass('active');
        var curIndex = $('.window .window-table-list-row').index(curRow);
        $('.window .window-table-measurement').eq(curIndex).addClass('active');
    });

    $('.catalogue-sort-title').click(function() {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.catalogue-sort-container').length == 0) {
            $('.catalogue-sort-container').removeClass('open');
        }
    });

    $('.catalogue-sort-item label').click(function() {
        $('.catalogue-sort-container').removeClass('open');
    });

    $('.catalogue-sort-item input').change(function() {
        updateCatalogue();
    });

    $('.catalogue-filter-item-title').click(function() {
        var curItem = $(this).parent();
        if (curItem.hasClass('open')) {
            curItem.removeClass('open');
            $('html').removeClass('catalogue-filter-item-open');
        } else {
            $('.catalogue-filter-item.open').removeClass('open');
            curItem.addClass('open');
            $('html').addClass('catalogue-filter-item-open');
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.catalogue-filter-item').length == 0 && $(window).width() > 1231) {
            $('.catalogue-filter-item').removeClass('open');
            $('html').removeClass('catalogue-filter-item-open');
        }
    });

    $('.catalogue-filter-list input').change(function() {
        var curItem = $(this).parents().filter('.catalogue-filter-item');
        var curCount = curItem.find('.catalogue-filter-list input:checked').length;
        curItem.find('.catalogue-filter-item-title span').html(curCount);
        if (curCount == 0) {
            curItem.removeClass('active');
        } else {
            curItem.addClass('active');
        }
        updateCatalogueFilterMobile();
        updateCatalogue();
    });

    $('.catalogue-filter-list input:checked').each(function() {
        var curItem = $(this).parents().filter('.catalogue-filter-item');
        var curCount = curItem.find('.catalogue-filter-list input:checked').length;
        curItem.find('.catalogue-filter-item-title span').html(curCount);
        if (curCount == 0) {
            curItem.removeClass('active');
        } else {
            curItem.addClass('active');
        }
    });

    $('.catalogue-filter-slider .form-slider').each(function() {
        var curSlider = $(this);
        var curRange = curSlider.find('.form-slider-range-inner')[0];
        var curStartFrom = Number(curSlider.find('.form-slider-min').html());
        if (Number(curSlider.find('.form-slider-from').val()) !== 0) {
            curStartFrom = Number(curSlider.find('.form-slider-from').val());
        }
        var curStartTo = Number(curSlider.find('.form-slider-max').html());
        if (Number(curSlider.find('.form-slider-to').val()) !== 0) {
            curStartTo = Number(curSlider.find('.form-slider-to').val());
        }
        noUiSlider.create(curRange, {
            start: [curStartFrom, curStartTo],
            connect: true,
            range: {
                'min': Number(curSlider.find('.form-slider-min').html()),
                'max': Number(curSlider.find('.form-slider-max').html())
            },
            step: Number(curSlider.find('.form-slider-step').html()),
            format: wNumb({
                decimals: 0
            })
        });
        curRange.noUiSlider.on('update', function(values, handle) {
            if (handle == 0) {
                curSlider.find('.form-slider-from').val(values[handle]);
                curSlider.find('.form-slider-hints-from span').html(values[handle]);
                if (values[handle] == Number(curSlider.find('.form-slider-min').html())) {
                    curSlider.find('.form-slider-hints-from').removeClass('active');
                } else {
                    curSlider.find('.form-slider-hints-from').addClass('active');
                }
            } else {
                curSlider.find('.form-slider-to').val(values[handle]);
                curSlider.find('.form-slider-hints-to span').html(values[handle]);
                if (values[handle] == Number(curSlider.find('.form-slider-max').html())) {
                    curSlider.find('.form-slider-hints-to').removeClass('active');
                } else {
                    curSlider.find('.form-slider-hints-to').addClass('active');
                }
            }
        });
        curSlider.find('.form-slider-hints-remove').click(function(e) {
            var curHint = $(this).parent();
            if (curHint.hasClass('form-slider-hints-from')) {
                curRange.noUiSlider.set([0, null], true, true);
            } else {
                curRange.noUiSlider.set([null, 9999999999], true, true);
            }
            updateCatalogueFilterMobile();
            updateCatalogue();
            e.preventDefault();
        });
    });

    $('.catalogue-filter-slider-btn a').click(function(e) {
        var curItem = $(this).parents().filter('.catalogue-filter-item');
        var curSlider = curItem.find('.catalogue-filter-slider .form-slider');
        var titleText = '';
        if (curSlider.find('.form-slider-hints-from').hasClass('active') || curSlider.find('.form-slider-hints-to').hasClass('active')) {
            titleText = curSlider.find('.form-slider-hints-from span').html() + ' — ' + curSlider.find('.form-slider-hints-to span').html();
        }
        if (titleText != '') {
            curItem.addClass('active');
            curItem.find('.catalogue-filter-item-title strong').html(titleText);
        } else {
            curItem.removeClass('active');
            curItem.find('.catalogue-filter-item-title strong').html('');
        }
        if ($(window).width() > 1231) {
            $('.catalogue-filter-item').removeClass('open');
        }
        updateCatalogueFilterMobile();
        updateCatalogue();
        e.preventDefault();
    });

    $('.catalogue-filter-slider-btn a').each(function(e) {
        var curItem = $(this).parents().filter('.catalogue-filter-item');
        var curSlider = curItem.find('.catalogue-filter-slider .form-slider');
        var titleText = '';
        if (curSlider.find('.form-slider-hints-from').hasClass('active') || curSlider.find('.form-slider-hints-to').hasClass('active')) {
            titleText = curSlider.find('.form-slider-hints-from span').html() + ' — ' + curSlider.find('.form-slider-hints-to span').html();
        }
        if (titleText != '') {
            curItem.addClass('active');
            curItem.find('.catalogue-filter-item-title strong').html(titleText);
        } else {
            curItem.removeClass('active');
            curItem.find('.catalogue-filter-item-title strong').html('');
        }
    });

    $('.catalogue-filter-item-remove').click(function(e) {
        var curItem = $(this).parents().filter('.catalogue-filter-item');
        curItem.find('.catalogue-filter-list input').prop('checked', false);
        curItem.find('.catalogue-filter-item-title span').html('0');
        var curSlider = curItem.find('.catalogue-filter-slider .form-slider');
        if (curSlider.length == 1) {
            var curRange = curSlider.find('.form-slider-range-inner')[0];
            curRange.noUiSlider.set([0, 9999999999], true, true);
        }
        curItem.removeClass('active open');
        updateCatalogueFilterMobile();
        updateCatalogue();
        return false;
    });

    $('.catalogue-filter-reset').click(function(e) {
        $('.catalogue-filter-item.active').each(function() {
            var curItem = $(this);
            curItem.find('.catalogue-filter-list input').prop('checked', false);
            curItem.find('.catalogue-filter-item-title span').html('0');
            var curSlider = curItem.find('.catalogue-filter-slider .form-slider');
            if (curSlider.length == 1) {
                var curRange = curSlider.find('.form-slider-range-inner')[0];
                curRange.noUiSlider.set([0, 9999999999], true, true);
            }
            curItem.removeClass('active open');
        });
        updateCatalogueFilterMobile();
        updateCatalogue();
        e.preventDefault();
    });

    $('body').on('click', '.catalogue-container .pager a', function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('active')) {
            $('.catalogue-container .pager a.active').removeClass('active');
            curLink.addClass('active');
            if (e.originalEvent === undefined) {
                updateCatalogue();
            } else {
                updateCatalogue(true);
            }
        }
        e.preventDefault();
    });

    $('body').on('click', '.catalogue-empty-btn a', function(e) {
        $('.catalogue-filter-item-remove').trigger('click');
        e.preventDefault();
    });

    $('.catalogue-filter-mobile-link a').click(function(e) {
        var curScroll = $(window).scrollTop();
        $('html').addClass('catalogue-filter-open');
        $('html').data('scrollTop', curScroll);
        $('.wrapper').css('margin-top', -curScroll);
        e.preventDefault();
    });

    $('.catalogue-ctrl-close').click(function(e) {
        $('html').removeClass('catalogue-filter-open');
        $('.wrapper').css('margin-top', 0);
        $(window).scrollTop($('html').data('scrollTop'));
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.catalogue-filter-mobile-link').length == 0 && $(e.target).parents().filter('.catalogue-ctrl').length == 0) {
            $('html').removeClass('catalogue-filter-open');
            $('.wrapper').css('margin-top', 0);
            $(window).scrollTop($('html').data('scrollTop'));
        }
    });

    $('.catalogue-ctrl-submit a').click(function(e) {
        $('.catalogue-ctrl-close').click();
        e.preventDefault();
    });

    $('.catalogue-ctrl-clear a').click(function(e) {
        $('.catalogue-filter-item-remove').trigger('click');
        $('.catalogue-ctrl-close').click();
        e.preventDefault();
    });

    if ($('.catalogue-filter').length == 1) {
        updateCatalogueFilterMobile();
    }

    $('.card-info-form').each(function() {
        var curForm = $(this);
        var validator = curForm.validate();
        if (validator) {
            validator.destroy();
        }
        curForm.validate({
            ignore: '',
            submitHandler: function(form) {
                if ($('.card-info-sizes input:checked').length == 0) {
                    windowOpenHTML($('#window-sizes').html());
                    $('.window .window-size-content').html('<div class="card-info-sizes">' + $('.card-info .card-info-sizes').html() + '</div>');
                } else {
                    var formData = new FormData(form);
                    windowOpen(curForm.attr('action'), formData);
                }
            }
        });
    });

    $('.card-info-sizes input').change(function() {
        $('.card-info-submit strong').html($('.card-info-sizes input:checked').parent().find('span').text());
    });

    $('.card-info-sizes input:checked').each(function() {
        $('.card-info-submit strong').html($('.card-info-sizes input:checked').parent().find('span').text());
    });

    $('body').on('click', '.window-size-btn a', function(e) {
        if ($('.window .card-info-sizes input:checked').length == 1) {
            var curIndex = $('.window .card-info-sizes input').index($('.window .card-info-sizes input:checked'));
            $('.card-info .card-info-sizes input').eq(curIndex).prop('checked', true);
            $('.card-info-form [type="submit"]').click();
        }
        e.preventDefault();
    });

    $('body').on('click', '.card-media-item-video-link', function(e) {
        var newHTML = '<iframe width="560" height="315" src="' + $(this).attr('href') + '?autoplay=1&controls=0&rel=0&showinfo=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
        var curItem = $(this).parent();
        curItem.append(newHTML);
        $(this).remove();
        e.preventDefault();
    });

    $('.cart-item-select-title').click(function() {
        var curItem = $(this).parent();
        if (curItem.hasClass('open')) {
            curItem.removeClass('open');
        } else {
            $('.cart-item-select.open').removeClass('open');
            curItem.addClass('open');
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.cart-item-select').length == 0) {
            $('.cart-item-select').removeClass('open');
        }
    });

    $('.cart-item-select-list input').change(function() {
        var curItem = $(this).parents().filter('.cart-item-select');
        curItem.find('.cart-item-select-title span').html($(this).parent().find('strong').html());
    });

    $('.cart-item-select-list label').click(function() {
        $('.cart-item-select.open').removeClass('open');
    });

    $('body').on('change', '.cart-item-count-container input', function() {
        var curInput = $(this);
        var curValue = Number(curInput.val());
        if (!curValue || (curValue < 1)) {
            curValue = 1;
        }
        curInput.val(curValue);
        recalcCart();
    });

    $('body').on('click', '.cart-item-count-inc', function(e) {
        var curField = $(this).parents().filter('.cart-item-count-container');
        var curValue = Number(curField.find('input').val());
        curValue++;
        curField.find('input').val(curValue);
        recalcCart();
        e.preventDefault();
    });

    $('body').on('click', '.cart-item-count-dec', function(e) {
        var curField = $(this).parents().filter('.cart-item-count-container');
        var curValue = Number(curField.find('input').val());
        curValue--;
        if (curValue < 1) {
            curValue = 1;
        }
        curField.find('input').val(curValue);
        recalcCart();
        e.preventDefault();
    });

    $('body').on('click', '.cart-item-remove a', function(e) {
        windowOpenHTML($('#window-cart-remove').html());
        $('.window .window-cart-remove-btn-apply').attr('data-id', $(this).parents().filter('.cart-item').attr('data-id'));
        recalcCart();
        e.preventDefault();
    });

    $('body').on('click', '.window .window-cart-remove-btn-apply', function(e) {
        var curID = $(this).attr('data-id');
        $('.cart-item[data-id="' + curID + '"]').remove();
        $('.header-cart-item[data-id="' + curID + '"]').remove();
        recalcCart();
        windowClose();
        e.preventDefault();
    });

    $('.header-cart-link').click(function(e) {
        $('html').addClass('header-cart-open');
        e.preventDefault();
    });

    $('.header-cart-window-close ').click(function(e) {
        $('html').removeClass('header-cart-open');
        e.preventDefault();
    });

    $('.header-cart-window-bg').click(function() {
        $('html').removeClass('header-cart-open');
    });

    $('body').on('change', '.header-cart-item-count-container input', function() {
        var curInput = $(this);
        var curValue = Number(curInput.val());
        if (!curValue || (curValue < 1)) {
            curValue = 1;
        }
        curInput.val(curValue);
    });

    $('body').on('click', '.header-cart-item-count-inc', function(e) {
        var curField = $(this).parents().filter('.header-cart-item-count-container');
        var curValue = Number(curField.find('input').val());
        curValue++;
        curField.find('input').val(curValue);
        e.preventDefault();
    });

    $('body').on('click', '.header-cart-item-count-dec', function(e) {
        var curField = $(this).parents().filter('.header-cart-item-count-container');
        var curValue = Number(curField.find('input').val());
        curValue--;
        if (curValue < 1) {
            curValue = 1;
        }
        curField.find('input').val(curValue);
        e.preventDefault();
    });

    $('body').on('click', '.header-cart-item-remove a', function(e) {
        windowOpenHTML($('#window-cart-remove').html());
        $('.window .window-cart-remove-btn-apply').attr('data-id', $(this).parents().filter('.header-cart-item').attr('data-id'));
        e.preventDefault();
    });

    $('.cabinet-orders-item').click(function(e) {
        var curItem = $(this);
        if (!curItem.hasClass('active')) {
            $('.cabinet-orders-item.active').removeClass('active');
            curItem.addClass('active');
            $('.cabinet-orders-detail').addClass('loading');
            curItem.addClass('loading');
            $.ajax({
                type: 'POST',
                url: curItem.attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                $('.cabinet-orders-detail').html(html);
                $('.cabinet-orders-detail').removeClass('loading');
                curItem.removeClass('loading');
                $('.cabinet-orders').addClass('open');
            });
        }
        e.preventDefault();
    });

    $('.cabinet-orders-back a').click(function(e) {
        $('.cabinet-orders').removeClass('open');
        e.preventDefault();
    });

    $('body').on('click', '.collection-detail-item-link', function(e) {
        $(this).parents().filter('.collection-detail-item').toggleClass('open');
        e.preventDefault();
    });

    $('body').on('click', '.collection-detail-item-header-close', function(e) {
        $(this).parents().filter('.collection-detail-item').removeClass('open');
        e.preventDefault();
    });

    $('.collection-detail-item-product-favourite').click(function(e) {
        $(this).parents().filter('.collection-detail-item-product').toggleClass('in-favourite');
        e.preventDefault();
    });

    $('.header-search-link').click(function(e) {
        var curScroll = $(window).scrollTop();
        $('html').addClass('search-open');
        $('.search-window-form-input input').focus();
        $('.wrapper').data('curScroll', curScroll);
        e.preventDefault();
    });

    $('.search-window-close').click(function(e) {
        $('html').removeClass('search-open');
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
        e.preventDefault();
    });

    $('body').on('keyup', '.search-window-form-input input', function() {
        var curForm = $('.search-window-form form');
        var formData = new FormData(curForm[0]);
        $.ajax({
            type: 'POST',
            url: curForm.attr('action'),
            processData: false,
            contentType: false,
            dataType: 'html',
            data: formData,
            cache: false
        }).done(function(html) {
            $('.search-window-results').html(html);
            initCataloguePreview();
        });
    });

    initCataloguePreview();

    $('body').on('mouseenter', '.catalogue-item-preview-tab', function() {
        var curSlide = $(this);
        var curPreview = curSlide.parents().filter('.catalogue-item-preview');
        var curIndex = curPreview.find('.catalogue-item-preview-tab').index(curSlide);
        curPreview.find('.catalogue-item-preview-slide.active').removeClass('active');
        curPreview.find('.catalogue-item-preview-slide').eq(curIndex).addClass('active');
        curPreview.find('.catalogue-item-preview-dot.active').removeClass('active');
        curPreview.find('.catalogue-item-preview-dot').eq(curIndex).addClass('active');
    });

    $('body').on('click', 'a.card-media-item-inner', function(e) {
        var curLink = $(this);
        var curItem = curLink;
        var curGallery = curItem.parents().filter('.card-media');
        var curIndex = curGallery.find('a.card-media-item-inner').index(curItem);

        $('.wrapper').data('curScroll', $(window).scrollTop());
        $('html').addClass('window-photo-open');

        var windowHTML =    '<div class="window-photo">';

        windowHTML +=           '<a href="#" class="window-photo-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-close"></use></svg></a>';

        windowHTML +=           '<div class="window-photo-slider">' +
                                    '<div class="window-photo-slider-list">' +
                                        '<div class="swiper-wrapper">';

        var galleryLength = curGallery.find('a.card-media-item-inner').length;
        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.find('a.card-media-item-inner').eq(i);
            windowHTML +=                   '<div class="window-photo-slider-list-item swiper-slide">' +
                                                '<div class="window-photo-slider-list-item-inner"><img src="' + pathTemplate + 'images/blank.gif" data-src="' + curGalleryItem.attr('href') + '" alt="" /></div>' +
                                            '</div>';
        }
        windowHTML +=                   '</div>' +
                                        '<div class="swiper-pagination"></div>' +
                                        '<div class="swiper-button-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></div>' +
                                        '<div class="swiper-button-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></div>' +
                                    '</div>' +
                                '</div>';

        windowHTML +=       '</div>';

        $('.window-photo').remove();
        $('body').append(windowHTML);

        const swiper = new Swiper($('.window-photo-slider-list')[0], {
            touchAngle: 30,
            loop: true,
            initialSlide: curIndex,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            on: {
                afterInit: function () {
                    var currentSlide = $('.window-photo-slider-list .swiper-slide-active');

                    var curIMG = currentSlide.find('img');
                    if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                        var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                        $('body').append(newIMG);
                        newIMG.one('load', function(e) {
                            curIMG.attr('src', curIMG.attr('data-src'));
                            newIMG.remove();
                        });
                        newIMG.attr('src', curIMG.attr('data-src'));
                        window.setTimeout(function() {
                            curIMG.attr('src', curIMG.attr('data-src'));
                            if (newIMG) {
                                newIMG.remove();
                            }
                        }, 3000);
                    }
                },
                slideChangeTransitionEnd: function () {
                    var currentSlide = $('.window-photo-slider-list .swiper-slide-active');

                    var curIMG = currentSlide.find('img');
                    if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                        var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                        $('body').append(newIMG);
                        newIMG.one('load', function(e) {
                            curIMG.attr('src', curIMG.attr('data-src'));
                            newIMG.remove();
                        });
                        newIMG.attr('src', curIMG.attr('data-src'));
                        window.setTimeout(function() {
                            curIMG.attr('src', curIMG.attr('data-src'));
                            if (newIMG) {
                                newIMG.remove();
                            }
                        }, 3000);
                    }
                }
            }
        });

        e.preventDefault();
    });

    $('body').on('click', '.window-photo-close', function(e) {
        $('.window-photo').remove();
        $('html').removeClass('window-photo-open');
        $(window).scrollTop($('.wrapper').data('curScroll'));
        e.preventDefault();
    });

    $('body').on('click', '.window-photo-slider-list-item-inner', function() {
        $('.window-photo-close').trigger('click');
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.window-photo').length > 0) {
                $('.window-photo-close').trigger('click');
            }
        }
    });

    $('.auth-sms-timer').each(function() {
        updateSMSTimer();
    });

    $('.cabinet-profile-password-title a').click(function(e) {
        $('.cabinet-profile-password').toggleClass('open');
        e.preventDefault();
    });

    $('.cart-side-promo-link a').click(function(e) {
        $('.cart-side-promo').addClass('open');
        e.preventDefault();
    });

    $('.cart-side-promo-send').click(function(e) {
        var curInput = $('.cart-side-promo-form .form-input input');
        curInput.parent().find('label.error').remove();
        curInput.removeClass('error');
        if (curInput.val() == '') {
            curInput.parent().append('<label class="error">' + curInput.attr('data-error') + '</label>');
            curInput.addClass('error');
        } else {
            $('.cart-side-promo-form').addClass('loading');
            $.ajax({
                type: 'POST',
                url: $('.cart-side-promo-send').attr('href'),
                dataType: 'json',
                data: 'promo=' + curInput.val(),
                cache: false
            }).fail(function(jqXHR, textStatus, errorThrown) {
                curInput.parent().append('<label class="error">Сервис временно недоступен, попробуйте позже.</label>');
                $('.cart-side-promo-form').removeClass('loading');
            }).done(function(data) {
                if (data.status) {
                    $('.cart-side-promo-form').addClass('success');
                    curInput.prop('disabled', true);
                    curInput.parent().append('<label class="error success">' + data.message + '</label>');
                    $('#cart-side-discount').html('-' + data.discount);
                    $('.cart-side-row-discount').addClass('visible');
                } else {
                    curInput.parent().append('<label class="error">' + data.message + '</label>');
                    $('#cart-side-discount').html('0');
                    $('.cart-side-row-discount').removeClass('visible');
                }
                recalcCart();
                $('.cart-side-promo-form').removeClass('loading');
            });
        }
        e.preventDefault();
    });

    $('.cart-side-promo-reset').click(function(e) {
        var curInput = $('.cart-side-promo-form .form-input input');
        curInput.parent().find('label.error').remove();
        curInput.removeClass('error');
        $('.cart-side-promo-form').addClass('loading');
        $.ajax({
            type: 'POST',
            url: $('.cart-side-promo-reset').attr('href'),
            dataType: 'json',
            data: 'promo=' + curInput.val(),
            cache: false
        }).fail(function(jqXHR, textStatus, errorThrown) {
            curInput.parent().append('<label class="error">Сервис временно недоступен, попробуйте позже.</label>');
            $('.cart-side-promo-form').removeClass('loading');
        }).done(function(data) {
            if (data.status) {
                $('.cart-side-promo-form').removeClass('success');
                curInput.prop('disabled', false);
                curInput.val('').blur();
                $('#cart-side-discount').html('0');
                $('.cart-side-row-discount').removeClass('visible');
                recalcCart();
            } else {
                curInput.parent().append('<label class="error">' + data.message + '</label>');
            }
            $('.cart-side-promo-form').removeClass('loading');
        });
        e.preventDefault();
    });

    $('.cart-side-promo-form .form-input input').keydown(function(e) {
        if (e.keyCode === 13) {
            $('.cart-side-promo-send').click();
            e.preventDefault();
        }
    });

    $('#order-city').change(function() {
        $('.order-delivery').addClass('visible');
        $('.order-payment').addClass('visible');
    });

    $('.order-delivery-list input').change(function() {
        if ($('#delivery-self').prop('checked')) {
            $('.order-delivery-detail').removeClass('visible');
            $('.order-comment').removeClass('visible');
        } else {
            $('.order-delivery-detail').addClass('visible');
            $('.order-comment').addClass('visible');
        }
        recalcCart();
    });

    $('.order-delivery-list').each(function(e) {
        $('.order-delivery-list input').eq(0).change();
    });

    $('#order-phone').change(function() {
        var curInput = $(this);
        if (curInput.val() != '') {
            curInput.parent().addClass('loading');
            $.ajax({
                type: 'POST',
                url: curInput.attr('data-check'),
                dataType: 'json',
                data: 'phone=' + curInput.val(),
                cache: false
            }).fail(function(jqXHR, textStatus, errorThrown) {
                curInput.parent().removeClass('loading');
            }).done(function(data) {
                if (data.status) {
                    curInput.parent().find('.order-phone-has').addClass('visible');
                } else {
                    curInput.parent().find('.order-phone-has').removeClass('visible');
                }
                curInput.parent().removeClass('loading');
            });
        }
    });

    $('.card-info').stickySidebar({
        topSpacing: 68,
        bottomSpacing: 20,
        containerSelector: '.card',
        innerWrapperSelector: '.card-info-inner',
        minWidth: 1232
    });

});

function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');
    curForm.find('input.codeSMS').mask('000000');

	curForm.find('.form-input input').each(function() {
		if ($(this).val() != '') {
			$(this).parent().addClass('full');
		} else {
			$(this).parent().removeClass('full');
		}
	});

    curForm.find('.form-input input:focus, .form-input textarea:focus').each(function() {
        $(this).trigger('focus');
    });

    curForm.find('.form-input input').blur(function(e) {
        $(this).val($(this).val()).change();
    });

    var indexFormInput = 0;
    curForm.find('.form-input-date input').each(function() {
        var curInput = $(this);
        curInput.attr('autocomplete', 'off');
        curInput.prop('readonly', true);
        var curID = 'form-input-date-id-' + indexFormInput;
        curInput.attr('id', curID);
        indexFormInput++;
        new AirDatepicker('#' + curID, {
            classes: 'form-input-datepicker',
            prevHtml: '<svg viewBox="0 0 20 20"><path d="M12.5 5L7.5 10L12.5 15" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" /></svg>',
            nextHtml: '<svg viewBox="0 0 20 20"><path d="M7.5 15L12.5 10L7.5 5" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" /></svg>'
        });
    });

    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        var options = {
            minimumResultsForSearch: 20
        }

        if (curSelect.parents().filter('.window').length == 1) {
            options['dropdownParent'] = $('.window-container');
        }

        if (curSelect.parent().hasClass('form-select-ajax-city')) {
            options['ajax'] = {
                url: curSelect.parent().attr('data-link'),
                dataType: 'json',
                data: function (params) {
                    var query = {
                        term: params.term,
                        _type: params._type
                    }
                    return query;
                }
            };
            options['minimumInputLength'] = 3;
            options['placeholder'] = curSelect.parent().attr('data-placeholder');
            options['templateResult'] = formatRepoCity;
            options['templateSelection'] = formatRepoSelectionCity;
        }

        curSelect.select2(options);

        curSelect.parent().find('.select2-container').attr('data-placeholder', curSelect.attr('data-placeholder'));
        curSelect.parent().find('.select2-selection').attr('data-placeholder', curSelect.attr('data-placeholder'));
        curSelect.on('select2:select', function(e) {
            $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full');
            if (typeof curSelect.attr('multiple') !== 'undefined') {
                $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full-multiple');
            }
            curSelect.parent().find('select.error').removeClass('error');
            curSelect.parent().find('label.error').remove();
            curSelect.parent().find('select').addClass('valid');
        });

        curSelect.on('select2:unselect', function(e) {
            if (curSelect.find('option:selected').length == 0) {
                curSelect.parent().find('.select2-container').removeClass('select2-container--full select2-container--full-multiple');
                curSelect.parent().find('select').removeClass('valid');
            }
        });

        if (curSelect.val() != '' && curSelect.val() !== null) {
            curSelect.trigger({type: 'select2:select'})
            curSelect.parent().find('.select2-container').addClass('select2-container--full');
            curSelect.parent().find('select').addClass('valid');
            if (typeof curSelect.attr('multiple') !== 'undefined') {
                $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full-multiple');
            }
        }
    });

    curForm.find('.captcha-container').each(function() {
        if ($('script#smartCaptchaScript').length == 0) {
            $('body').append('<script src="https://captcha-api.yandex.ru/captcha.js?render=onload&onload=smartCaptchaLoad" defer id="smartCaptchaScript"></script>');
        } else {
            if (window.smartCaptcha) {
                var curID = window.smartCaptcha.render(this, {
                    sitekey: smartCaptchaKey,
                    callback: smartCaptchaCallback,
                    invisible: true,
                    hideShield: true
                });
                $(this).attr('data-smartid', curID);
            }
        }
    });

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);

            var smartCaptchaWaiting = false;
            curForm.find('.captcha-container').each(function() {
                if (curForm.attr('form-smartcaptchawaiting') != 'true') {
                    var curBlock = $(this);
                    var curInput = curBlock.find('input[name="smart-token"]');
                    curInput.removeAttr('value');
                    smartCaptchaWaiting = true;
                    $('form[form-smartcaptchawaiting]').removeAttr('form-smartcaptchawaiting');
                    curForm.attr('form-smartcaptchawaiting', 'false');

                    if (!window.smartCaptcha) {
                        alert('Сервис временно недоступен, попробуйте позже.');
                        return;
                    }
                    var curID = $(this).attr('data-smartid');
                    window.smartCaptcha.execute(curID);
                } else {
                    curForm.removeAttr('form-smartcaptchawaiting');
                }
            });

            if (!smartCaptchaWaiting) {

                if (curForm.hasClass('ajax-form')) {
                    curForm.addClass('loading');
                    var formData = new FormData(form);

                    if (curForm.find('[type=file]').length != 0) {
                        var file = curForm.find('[type=file]')[0].files[0];
                        formData.append('file', file);
                    }

                    $.ajax({
                        type: 'POST',
                        url: curForm.attr('action'),
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        data: formData,
                        cache: false
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        curForm.find('.message').remove();
                        curForm.append('<div class="message message-error"><div class="message-title">Ошибка!</div><div class="message-text">Сервис временно недоступен, попробуйте позже.</div></div>')
                        curForm.removeClass('loading');
                    }).done(function(data) {
                        curForm.find('.message').remove();
                        if (data.status) {
                            curForm.html('<div class="message message-success"><div class="message-title">' + data.title + '</div><div class="message-text">' + data.message + '</div></div>')
                        } else {
                            curForm.append('<div class="message message-error"><div class="message-title">' + data.title + '</div><div class="message-text">' + data.message + '</div></div>')
                        }
                        curForm.removeClass('loading');
                    });
                } else {
                    form.submit();
                }
            }
        }
    });
}

var smartCaptchaKey = 'uahGSHTKJqjaJ0ezlhjrbOYH4OxS6zzL9CZ47OgY';

function smartCaptchaLoad() {
    $('.captcha-container').each(function() {
        if (!window.smartCaptcha) {
            return;
        }
        var curID = window.smartCaptcha.render(this, {
            sitekey: smartCaptchaKey,
            callback: smartCaptchaCallback,
            invisible: true,
            hideShield: true
        });
        $(this).attr('data-smartid', curID);
    });
}

function smartCaptchaCallback(token) {
    $('form[form-smartcaptchawaiting]').attr('form-smartcaptchawaiting', 'true');
    $('form[form-smartcaptchawaiting] [type="submit"]').trigger('click');
}

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        $('.window form').each(function() {
            initForm($(this));
        });

        $(window).trigger('resize');

        if ($('.window .in-cart-success').length == 1) {
            $('.card-info-ctrl').addClass('in-cart');
        }
    });
}

function windowOpenHTML(html) {
    if ($('.window').length == 0) {
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    if ($('.window-container').length == 0) {
        $('.window').html('<div class="window-container">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');
    } else {
        $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
        $('.window .window-loading').remove();
    }

    if ($('.window .window-table').length == 1) {
        var curIndex = $('.card-info-sizes input').index($('.card-info-sizes input:checked'));
        if (curIndex > -1) {
            $('.window .window-table-list-row').eq(curIndex).trigger('click');
        }
        $('.window').addClass('window-from-side');
    }

    $('.window form').each(function() {
        initForm($(this));
    });

    $(window).trigger('resize');
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
    }
}

function updateCatalogue(isScroll) {
    $('.catalogue-list').addClass('loading');
    var curForm = $('.catalogue-ctrl form');
    var curData = curForm.serialize();
    curData += '&page=' + $('.pager a.active').attr('data-value');
    $.ajax({
        type: 'POST',
        url: curForm.attr('action'),
        dataType: 'html',
        data: curData,
        cache: false
    }).done(function(html) {
        $('.catalogue-list').html($(html).find('.catalogue-list').html());
        initCataloguePreview();
        $('.catalogue-ctrl-submit span').html($(html).find('.catalogue-list').attr('data-count'));
        $('.catalogue-container .pager').html($(html).find('.pager').html());
        if (($(window).scrollTop() > $('.catalogue').offset().top) && isScroll) {
            $('html, body').animate({'scrollTop': 0});
        }
        $('.catalogue-list').removeClass('loading');
    });
}

function updateCatalogueFilterMobile() {

    var countFilter = 0;
    $('.catalogue-filter-item').each(function() {
        var curItem = $(this);
        var curTitle = curItem.find('.catalogue-filter-item-title');
        curTitle.find('em').remove();
        curTitle.find('svg.catalogue-filter-list-item-color').remove();

        curItem.find('.catalogue-filter-list-item input:checked').each(function() {
            var curInput = $(this);
            if (curInput.parent().find('span .catalogue-filter-list-item-color').length == 1) {
                var curSVG = curInput.parent().find('span .catalogue-filter-list-item-color');
                curTitle.append('<svg style="' + curSVG.attr('style') + '" class="catalogue-filter-list-item-color"><use xlink:href="' + pathTemplate + 'images/sprite.svg#card-color"></use></svg>');
            } else {
                curTitle.append('<em>' + curInput.parent().find('span').text() + '</em>');
            }
        });
        if (curItem.find('.catalogue-filter-list-item input:checked').length > 0) {
            countFilter++;
        }

        var curSlider = curItem.find('.catalogue-filter-slider .form-slider');
        if (curSlider.length == 1) {
            var titleText = '';
            if (curSlider.find('.form-slider-hints-from').hasClass('active') || curSlider.find('.form-slider-hints-to').hasClass('active')) {
                titleText = curSlider.find('.form-slider-hints-from span').html() + ' — ' + curSlider.find('.form-slider-hints-to span').html();
            }

            if (titleText != '') {
                curTitle.append('<em>' + titleText + ' ₽</em>');
                countFilter++;
            }
        }
    });
    if (countFilter > 0) {
        $('.catalogue-filter-mobile-link span').html('(' + countFilter + ')').addClass('visible');
        $('.catalogue-filter-reset').addClass('visible');
    } else {
        $('.catalogue-filter-mobile-link span').html('(' + countFilter + ')').removeClass('visible');
        $('.catalogue-filter-reset').removeClass('visible');
    }

}

function initCataloguePreview() {
    $('.catalogue-item-preview').each(function() {
        var curPreview = $(this);
        curPreview.find('.catalogue-item-preview-slides .catalogue-item-preview-slide').eq(0).addClass('active');
        var countSlides = curPreview.find('.catalogue-item-preview-slides .catalogue-item-preview-slide').length;
        if (countSlides > 1) {
            if (curPreview.find('.catalogue-item-preview-tabs').length == 0) {
                var htmlTabs =  '<div class="catalogue-item-preview-tabs">';
                var htmlDots =  '<div class="catalogue-item-preview-dots">';
                for (var i = 0; i < countSlides; i++) {
                    htmlTabs +=     '<div class="catalogue-item-preview-tab"></div>';
                    htmlDots +=     '<div class="catalogue-item-preview-dot"></div>';
                }
                htmlTabs +=     '</div>';
                htmlDots +=     '</div>';
                curPreview.append(htmlTabs + htmlDots);
                curPreview.find('.catalogue-item-preview-dot').eq(0).addClass('active');

                var htmlSlider =    '<div class="catalogue-item-preview-swiper swiper"><div class="swiper-wrapper">';
                for (var i = 0; i < countSlides; i++) {
                    htmlSlider +=       '<div class="swiper-slide">' + curPreview.find('.catalogue-item-preview-slides .catalogue-item-preview-slide').eq(i).html() + '</div>';
                }
                htmlSlider +=       '</div><div class="swiper-pagination"></div></div>';
                curPreview.append(htmlSlider);
                new Swiper(curPreview.find('.catalogue-item-preview-swiper')[0], {
                    loop: true,
                    touchAngle: 30,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                });
            }
        }
    });
}

$(window).on('load', function() {
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    $('.slider-item-inner').css({'height': (windowHeight - 40) + 'px'});
});

var mediaSwiper = null;

$(window).on('load resize', function() {

    $('.card-media-list').each(function() {
        var curSlider = $(this);
        if ($(window).width() < 1232) {
            if (!curSlider.hasClass('swiper-initialized')) {
                curSlider.wrapInner('<div class="swiper-wrapper"></div>');
                curSlider.find('.card-media-item').addClass('swiper-slide');
                curSlider.append('<div class="swiper-pagination"></div>');
                mediaSwiper = new Swiper(curSlider[0], {
                    touchAngle: 30,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                });
            }
        } else {
            if (curSlider.hasClass('swiper-initialized')) {
                mediaSwiper.destroy();
                curSlider.find('.card-media-item').removeClass('swiper-slide');
                curSlider.find('.card-media-item').removeAttr('role');
                curSlider.find('.card-media-item').removeAttr('aria-label');
                curSlider.find('.card-media-item').removeAttr('style');
                curSlider.html(curSlider.find('.swiper-wrapper').html());
            }
        }
    });

    $('.cabinet-orders-item').each(function() {
        var curItem = $(this);
        var maxItems = 5;
        if ($(window).width() < 1232) {
            maxItems = 4;
        }
        var curDiff = curItem.find('.cabinet-orders-item-goods-item').length - maxItems;
        curItem.find('.cabinet-orders-item-more').removeClass('visible');
        if (curDiff > 0) {
            curItem.find('.cabinet-orders-item-more').html('+' + curDiff);
            curItem.find('.cabinet-orders-item-more').addClass('visible');
        }
    });

});

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();

    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    if (windowScroll > 0) {
        $('header').addClass('fixed');
    } else {
        $('header').removeClass('fixed');
    }

    $('.order-onestep .cart-side').each(function() {
        var curBlock = $(this);
        var offsetTop = 68;
        if (windowScroll > curBlock.offset().top - offsetTop) {
            curBlock.addClass('fixed');
            if (windowScroll + offsetTop + curBlock.find('.cart-side-inner').outerHeight() > $('.order-onestep').offset().top + $('.order-onestep').outerHeight()) {
                curBlock.find('.cart-side-inner').css({'margin-top': ($('.order-onestep').offset().top + $('.order-onestep').outerHeight()) - (windowScroll + offsetTop + $('.cart-side-inner').outerHeight())});
            } else {
                curBlock.find('.cart-side-inner').css({'margin-top': 0});
            }
        } else {
            curBlock.removeClass('fixed');
        }
    });

    $('.catalogue-side').each(function() {
        var curBlock = $(this);
        var offsetTop = 45;
        if (windowScroll > curBlock.offset().top - offsetTop) {
            curBlock.addClass('fixed');
            if (windowScroll + offsetTop + curBlock.find('.catalogue-side-inner').outerHeight() > $('.catalogue').offset().top + $('.catalogue').outerHeight()) {
                curBlock.find('.catalogue-side-inner').css({'margin-top': ($('.catalogue').offset().top + $('.catalogue').outerHeight()) - (windowScroll + offsetTop + $('.catalogue-side-inner').outerHeight())});
            } else {
                curBlock.find('.catalogue-side-inner').css({'margin-top': 0});
            }
        } else {
            curBlock.removeClass('fixed');
        }
    });

    $('.catalogue-ctrl').each(function() {
        var curBlock = $(this);
        var offsetTop = 70;
        if (windowScroll > curBlock.offset().top - offsetTop) {
            curBlock.addClass('fixed');
        } else {
            curBlock.removeClass('fixed');
        }
    });

});

function updateSMSTimer() {
    var curTime = Number($('.auth-sms-timer span').html());
    curTime--;
    if (curTime < 1) {
        curTime = 0;
    }
    $('.auth-sms-timer span').html(curTime);
    if (curTime > 0) {
        window.setTimeout(updateSMSTimer, 1000);
    }
}

function formatRepoCity(repo) {
    if (repo.loading) {
        return repo.text;
    }

    var $container = $(
        '<div class="select2-result-city">' +
            '<div class="select2-result-city-title"></div>' +
            '<div class="select2-result-city-description"></div>' +
        '</div>'
    );

    $container.find('.select2-result-city-title').text(repo.text);
    $container.find('.select2-result-city-description').text(repo.description);

    return $container;
}

function formatRepoSelectionCity(repo) {
    return repo.text;
}

function recalcCart() {
    var cartSumm = 0;
    $('.cart-item').each(function() {
        var curItem = $(this);
        var itemCount = Number(curItem.find('.cart-item-count-container input').val());
        var itemSumm = Number(curItem.find('.cart-item-price span').text().replace(/\ /g, ''));
        cartSumm += (itemCount * itemSumm);
    });
    $('#cart-side-cost').html(String(cartSumm).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
    var curDelivery = $('.order-delivery-list input:checked');
    if (curDelivery.length == 1) {
        var deliveryCost = Number(curDelivery.attr('data-price'));
        $('#cart-side-delivery').html(curDelivery.attr('data-title'));
        var curCost = Number($('#cart-side-cost').html().replace(/\ /g, ''));
        var curDiscount = 0;
        if ($('.cart-side-row-discount.visible').length == 1) {
            curDiscount = Number($('#cart-side-discount').html().replace(/\ /g, ''));
        }
        var curSumm = deliveryCost + curCost + curDiscount;
        $('#cart-side-summ, #cart-side-summ-fix').html(String(curSumm).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
    }
}

$(document).ready(function() {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        $('html').addClass('iphone');
    }
});