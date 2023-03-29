var projects = false;

    function readTextFile(file, callback, error) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.onerror = error;
        rawFile.send(null);
    }

    /*****
     * Собираем массив данных
     *****/
    readTextFile("projects/projects.json", function (text) {
        var projects_info = JSON.parse(text);
        projects = [];

        //Вытаскиваем наименования проектов
        for (let proj_key in projects_info) {
            let proj = projects_info[proj_key];
            projects.push({
                proj_name: proj.name,
                proj_path: 'projects/' + proj_key + '/',
                total_elems: proj.total_elems,
                elems: []
            })
        }

        //Вытаскиваем наименования проектов
        for (let key in projects) {
            let project = projects[key];
            for (let i = 1; i <= project.total_elems; i++)
                readTextFile(project.proj_path + i + '/datas.json', function (elem_info) {
                    let datas_json = JSON.parse(elem_info);
                    project.elems[i - 1] = datas_json;
                    project.elems[i - 1].img = project.proj_path + i + '/plan.png';
                    if (projects.length - 1 == key && i == project.total_elems) {
                        //Старт
                        init();

                        //Event а Фильтры
                        $('.fmf_rooms .fmf_room').click(function () {
                            if ($(this).hasClass('active'))
                                $(this).removeClass('active');
                            else
                                $(this).addClass('active');
                            getElems();
                        })
                    }
                });
        }
    });

    /*****
     * Получение фильтров
     *****/
    function init() {
        /*****
         * Получение Проектов
         *****/
        let list = '', i = 0;
        for (let project_id in projects) {
            let project = projects[project_id];
            list += `<div class="fh_tab${i == 0 ? ' active' : ''}" data-id="${project_id}" onclick="getElems(${project_id},this)">${project.proj_name}</div>`;
            i++;
        }
        if ($('.fh_tabs').html(list)) {
            consolelog();
            getElems();
        }
    }

    function getElems(proj_id = false, proj_tag = false) {
        let list = '';

        /*****
         * Event get Active
         *****/
        if (proj_tag !== false) {
            $('.fh_tabs .fh_tab').removeClass('active');
            $(proj_tag).addClass('active');
        }

        /*****
         * ID проекта
         *****/
        if (proj_id === false)
            $('.fh_tabs .fh_tab').each((indx, el) => {
                if ($(el).hasClass('active')) proj_id = +$(el).attr('data-id');
            });

        /*****
         * Получение Проектов
         *****/
        let project = projects[proj_id];

        /*****
         * Фильтры
         *****/
        let rooms = false;
        $('.fmf_rooms .fmf_room').each((indx, el) => {
            if ($(el).hasClass('active')) {
                if (rooms === false) rooms = [];
                rooms.push(+$(el).text().trim());
            }
        })

        /*****
         * Сбор инфы
         *****/
        let counter = 0;
        for (let proj_elem_key in project.elems) {
            let proj_elem = project.elems[proj_elem_key];

            //Фильтр
            if (rooms !== false) {
                if (rooms.indexOf(+proj_elem.rooms) < 0)
                    continue;
            }

            list += `<div class="fml_elem" data-id="${proj_elem_key}" onclick="getView(this,${proj_id},${proj_elem_key})"><img src="${proj_elem.img}"></div>`;
            counter++;
        }
        list += `<div class="fml_elem_noone">Ничего не найдено :(</div>`;
        if ($('.fm_inn_list').html(list)) {
            /*****
             * Показ первого
             *****/
            if (counter != 0){
                $('.fm_inn_list').children().eq(0).addClass('active').trigger('click');
                $('.fm_r ').removeClass('noone');
            }
            /*****
             * Вывод общего кол-ва
             *****/
            $('.fm_total span').text(counter);

            /*****
             * Показ текста ничего не найдено
             *****/
            if (counter == 0){
                $('.fml_elem_noone').addClass('show');
                $('.fm_r ').addClass('noone');
            }else
                $('.fml_elem_noone').removeClass('show');
        }
    }


    function getView(el, proj_id, elem_id) {
        /*****
         * Event
         *****/
        $('.fm_inn_list').children().removeClass('active');
        $(el).addClass('active');
        /*****
         * Какой из списка
         *****/
        let numb_now = +$('.fm_inn_list').children().index($(el)) + 1;
        $('.mrht_now').text(numb_now);

        /*****
         * Общее кол-во в списке
         *****/
        let total = +$('.fm_inn_list').children().length-1;
        $('.mrht_all').text(total);

        /*************************
         * Вывод инфы
         *************************/
        let info = projects[proj_id].elems[elem_id];

        /*****
         * Вывод IMG
         *****/
        $('.mr_img').html(`<img src="${info.img}" alt="Изображение плана">`);

        /*****
         * Вывод аксции
         *****/
        $('.mrh_akciya').text(info.akciya);

        /*****
         * Вывод параметров
         *****/
        let cols = $('.mr_datas .mr_data_col');
        [
            'proj_name',//Проект
            'area',//Площадь
            'floor',//Этаж
            'rooms',//Комнат
            'price',//Стоимость
            'ipoteka'//В ипотеку
        ].forEach((elem_name,elem_indx)=>cols.eq(elem_indx).find('.mr_dc_val').text(info[elem_name] ?? '-'))

    }

    function consolelog() {
        console.log(projects);
    }