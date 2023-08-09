$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
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
        var curGallery = $(this);
        curGallery.on('init', function(event, slick) {
            var curSlide = curGallery.find('.slick-current');
            var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
            curGallery.find('.slick-dots').css({'top': curPhotoHeight});
            curGallery.find('.slick-prev').css({'top': curPhotoHeight / 2});
            curGallery.find('.slick-next').css({'top': curPhotoHeight / 2});
        });
        var options = {
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></button>',
            adaptiveHeight: true,
            dots: true,
            responsive: [
                {
                    breakpoint: 1231,
                    settings: {
                        arrows: false
                    }
                }
            ]
        };
        curGallery.slick(
            options
        ).on('setPosition', function(event, slick) {
            var curSlide = curGallery.find('.slick-current');
            var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
            curGallery.find('.slick-dots').css({'top': curPhotoHeight});
            curGallery.find('.slick-prev').css({'top': curPhotoHeight / 2});
            curGallery.find('.slick-next').css({'top': curPhotoHeight / 2});
        }).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            var curSlide = curGallery.find('.slick-slide:not(.slick-cloned)').eq(nextSlide);
            var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
            curGallery.find('.slick-dots').css({'top': curPhotoHeight});
            curGallery.find('.slick-prev').css({'top': curPhotoHeight / 2});
            curGallery.find('.slick-next').css({'top': curPhotoHeight / 2});
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

    $('.slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 1000,
        pauseOnFocus: false,
        pauseOnHover: false,
        pauseOnDotsHover: false
    }).on('setPosition', function(event, slick) {
        var curIndex = $('.slider').slick('slickCurrentSlide');
        $('.slider .slick-dots li button.active').removeClass('active');
        $('.slider .slick-dots li button').eq(curIndex).addClass('active');
        if ($('.slider .slick-current .slider-item').hasClass('inverse')) {
            $('header').addClass('inverse');
        } else {
            $('header').removeClass('inverse');
        }
    }).on('beforeChange', function(event, slick, currentSlide, nextSlide){
        var curSlide = $('.slick-slide:not(.slick-cloned)').eq(nextSlide);
        if (curSlide.find('.slider-item').hasClass('inverse')) {
            $('header').addClass('inverse');
        } else {
            $('header').removeClass('inverse');
        }
    });

    $('.main-catalogue .catalogue-list').each(function() {
        var curList = $(this);
        var curParent = $(this).parents().filter('.main-catalogue');
        var countSlides = 4;
        if (curParent.hasClass('other-catalogue')) {
            countSlides = 6;
        }
        curList.slick({
            infinite: false,
            slidesToShow: countSlides,
            slidesToScroll: countSlides,
            prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-prev"></use></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-next"></use></svg></button>',
            dots: false,
            responsive: [
                {
                    breakpoint: 1231,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        arrows: false,
                        dots: true
                    }
                }
            ]
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
        curBlock.find('.card-info-block-container').slideToggle();
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

    $('body').on('click', '.window-size-btn a', function(e) {
        if ($('.window .card-info-sizes input:checked').length == 1) {
            var curIndex = $('.window .card-info-sizes input').index($('.window .card-info-sizes input:checked'));
            $('.card-info .card-info-sizes input').eq(curIndex).prop('checked', true);
            $('.card-info-form [type="submit"]').click();
        }
        e.preventDefault();
    });

    $('body').on('click', '.card-media-item-video-link', function(e) {
        var newHTML = '<video autoplay muted loop controls><source src="' + $(this).attr('href') + '" type="video/mp4" /></video>';
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
    });

    $('body').on('click', '.cart-item-count-inc', function(e) {
        var curField = $(this).parents().filter('.cart-item-count-container');
        var curValue = Number(curField.find('input').val());
        curValue++;
        curField.find('input').val(curValue);
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
        e.preventDefault();
    });

    $('body').on('click', '.cart-item-remove a', function(e) {
        windowOpenHTML($('#window-cart-remove').html());
        $('.window .window-cart-remove-btn-apply').attr('data-id', $(this).parents().filter('.cart-item').attr('data-id'));
        e.preventDefault();
    });

    $('body').on('click', '.window .window-cart-remove-btn-apply', function(e) {
        var curID = $(this).attr('data-id');
        $('.cart-item[data-id="' + curID + '"]').remove();
        $('.header-cart-item[data-id="' + curID + '"]').remove();
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
            $.ajax({
                type: 'POST',
                url: curItem.attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                $('.cabinet-orders-detail').html(html);
                $('.cabinet-orders-detail').removeClass('loading');
            });
        }
        e.preventDefault();
    });

    $('body').on('click', '.collection-detail-item-link', function(e) {
        $(this).parent().parent().toggleClass('open');
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
                                    '<div class="window-photo-slider-list">';

        var galleryLength = curGallery.find('a.card-media-item-inner').length;
        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.find('a.card-media-item-inner').eq(i);
            windowHTML +=               '<div class="window-photo-slider-list-item">' +
                                            '<div class="window-photo-slider-list-item-inner"><img src="' + pathTemplate + 'images/blank.gif" data-src="' + curGalleryItem.attr('href') + '" alt="" /></div>' +
                                        '</div>';
        }
        windowHTML +=               '</div>' +
                                '</div>';

        windowHTML +=       '</div>';

        $('.window-photo').remove();
        $('body').append(windowHTML);

        $('.window-photo-slider-list').slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></button>',
            dots: true,
            initialSlide: curIndex,
            responsive: [
                {
                    breakpoint: 1231,
                    settings: {
                        arrows: false
                    }
                }
            ]
        }).on('setPosition', function(event, slick) {
            var currentSlide = $('.window-photo-slider-list').slick('slickCurrentSlide');

            var curIMG = $('.window-photo-slider-list-item').eq(currentSlide).find('img');
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

    $('body').on('click', '.collections-item a', function(e) {
        if ($(window).width() < 1232) {
            var curLink = $(this);

            $('.wrapper').data('curScroll', $(window).scrollTop());
            $('html').addClass('window-collections-open');

            var windowHTML =    '<div class="window-collections">';

            windowHTML +=           '<a href="#" class="window-collections-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-collections-close"></use></svg></a>';

            windowHTML +=           '<div class="window-collections-loading"></div>';

            windowHTML +=       '</div>';

            $('.window-collections').remove();
            $('body').append(windowHTML);

            $.ajax({
                type: 'POST',
                url: curLink.attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                var newHTML = $(html);
                windowHTML =    '<div class="window-collections-container">';
                windowHTML +=       '<div class="window-collections-slider">';

                if (newHTML.find('.collection-header').length == 1) {
                    windowHTML +=       '<div class="window-collections-item window-collections-item-start">' +
                                            '<div class="window-collections-item-inner">' +
                                                '<div class="window-collections-item-preview" style="background-image:url(' + newHTML.find('.collection-header > img').attr('src') + ')"></div>' +
                                            '</div>' +
                                        '</div>';
                }

                newHTML.find('.collection-detail-item').each(function() {
                    var curItem = $(this);
                    windowHTML +=       '<div class="window-collections-item">' +
                                            '<div class="window-collections-item-inner">' +
                                                '<div class="window-collections-item-preview" style="background-image:url(' + curItem.find('.collection-detail-item-img > img').attr('src') + ')"></div>' +
                                                '<div class="window-collections-item-content">' + curItem.find('.collection-detail-item-content').html() + '</div>' +
                                            '</div>' +
                                        '</div>';
                });

                windowHTML +=       '</div>';

                windowHTML +=       '<div class="window-collections-info">';
                if (newHTML.find('.collection-header-title').length == 1) {
                    windowHTML +=       '<div class="window-collections-info-title">' + newHTML.find('.collection-header-title').html() + '</div>';
                }
                if (newHTML.find('.collection-detail-descr-inner').length == 1) {
                    windowHTML +=       '<div class="window-collections-info-text">' + newHTML.find('.collection-detail-descr-inner').html() + '</div>';
                }
                windowHTML +=           '<a href="#" class="window-collections-info-link"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#header-cart"></use></svg></a>';
                windowHTML +=       '</div>';
                windowHTML +=   '</div>';

                $('.window-collections-loading').remove();
                $('.window-collections').append(windowHTML);

                $('.window-collections-slider').slick({
                    infinite: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true
                }).on('setPosition', function(event, slick) {
                    var currentSlide = $('.window-collections-slider').slick('slickCurrentSlide');
                    var curSlide = $('.window-collections-item').eq(currentSlide);
                    if (curSlide.find('.window-collections-item-content').length == 1) {
                        $('.window-collections-info-link').addClass('visible');
                    } else {
                        $('.window-collections-info-link').removeClass('visible');
                    }
                });

            });

            e.preventDefault();
        }
    });

    $('body').on('click', '.window-collections-info-link', function(e) {
        var curSlider = $('.window-collections-slider');
        curSlider.addClass('disabled');
        var currentSlide = $('.window-collections-slider').slick('slickCurrentSlide');
        var curSlide = $('.window-collections-item').eq(currentSlide);
        var windowHTML =    '<div class="window-collections-detail">' +
                                curSlide.find('.window-collections-item-content').html() +
                            '</div>';
        $('body').append(windowHTML);
        e.preventDefault();
    });

    $('body').on('click', '.window-collections-close', function(e) {
        $('.window-collections').remove();
        $('.window-collections-detail').remove();
        $('html').removeClass('window-collections-open');
        $(window).scrollTop($('.wrapper').data('curScroll'));
        e.preventDefault();
    });

    $('body').on('click', '.collection-detail-item-header-close', function(e) {
        $('.window-collections-detail').remove();
        $('.window-collections-slider').removeClass('disabled');
        e.preventDefault();
    });

});

function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

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

    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        var options = {
            minimumResultsForSearch: 20
        }

        if (curSelect.parents().filter('.window').length == 1) {
            options['dropdownParent'] = $('.window-container');
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

    curForm.validate({
        ignore: ''
    });
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
    } else {
        $('.catalogue-filter-mobile-link span').html('(' + countFilter + ')').removeClass('visible');
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
            }
        }
    });
}

$(window).on('load resize', function() {

    $('.card-media-list').each(function() {
        if ($('.card-media-list').hasClass('slick-slider')) {
            $('.card-media-list').slick('unslick');
        }
        if ($(window).width() < 1232) {
            $('.card-media-list').slick({
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                adaptiveHeight: true
            });
        }
    });
    
    window.setTimeout(function() {
        $('.main-catalogue .slick-arrow').each(function() {
            $(this).css({'top': $('.catalogue-item-preview').eq(0).outerHeight() / 2});
        });
    }, 500);

});

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();
    if (windowScroll > 0) {
        $('header').addClass('fixed');
    } else {
        $('header').removeClass('fixed');
    }
});