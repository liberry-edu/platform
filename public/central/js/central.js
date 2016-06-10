var centralApp = angular.module('centralApp', ['ng-admin', 'ngFileUpload']);
    centralApp.config(['NgAdminConfigurationProvider', 'RestangularProvider', '$stateProvider', function(NgAdminConfigurationProvider, RestangularProvider, $stateProvider) {
        //Add auth details to all requests
        // var login = 'vaibhav',
        // password = 'password',
        // token = window.btoa(login + ':' + password);
        // RestangularProvider.setDefaultHeaders({'Authorization': 'Basic ' + token});

        //Change the query parameter names
        RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
            if (operation == 'getList') {
                params.offset = (params._page - 1) * params._perPage;
                params.limit = params._perPage;
                params.filters = params._filters;
                params.sortField = params._sortField;
                params.sortDir = params._sortDir;
                delete params._page;
                delete params._perPage;
                delete params._filters;
                delete params._sortField;
                delete params._sortDir;

                if(what == 'playlist_contents') {
                    params.sortField = 'position';
                    params.sortDir = 'ASC';
                }
            }
            return { params: params };
        });

        function upload(file, Upload) {
            Upload.upload({
                url: '/syncdb',
                data: {file: file, data: 'vaibhav'}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('Progress: ' + progressPercentage);
            });
        }

        //Add /sync to the UI Router
        function syncController($stateParams, $http, notification, Upload, $scope) {
            this.notification = notification;
            this.syncDb = function() {
                if($scope.file) {
                    upload($scope.file, Upload);
                    this.notification.log('Synced successfully');
                }
                else {
                    this.notification.log('Select a valid SQL file');
                }
            }
            this.prepareDriveContent = function() {
                var that = this;
                $http.get('/download').then(function(response) {
                    that.notification.log('Prepared content successfully');
                },
                function(err) {
                    that.notification.error();('Content preparation failed. Contact system administrator');
                });
            }
        };
        syncController.inject = ['$stateParams', '$http', 'notification', 'Upload', '$scope'];

        $stateProvider.state('sync', {
            parent: 'main',
            url: '/sync',
            params: {},
            controller: syncController,
            controllerAs: 'controller',
            templateUrl: 'html/sync.html'
        });

        //Start configuring ng-admin
        var nga = NgAdminConfigurationProvider;
        var admin = nga.application('Liberry Central')//.baseApiUrl('http://localhost:8000/');

        //Define entites
        var category = nga.entity('categories');
        var module = nga.entity('modules');
        var content = nga.entity('contents');
        var playlist = nga.entity('playlists');
        var playlist_content = nga.entity('playlist_contents');

        //Add category entity
        category.listView().fields([
            nga.field('name').isDetailLink(true),
            nga.field('description'),
            nga.field('status')
        ]);
        category.creationView().fields([
            nga.field('name'),
            nga.field('description'),
            nga.field('modules', 'referenced_list').targetEntity(module).targetReferenceField('category_id').targetFields([nga.field('name')])
        ]);
        category.editionView().fields(category.creationView().fields());
        admin.addEntity(category);

        //Add module entity
        module.listView().fields([
            nga.field('name').isDetailLink(true),
            nga.field('description'),
            nga.field('status'),
            nga.field('category_id', 'reference').label('Category').targetEntity(category).targetField(nga.field('name'))
        ]);
        module.creationView().fields([
            nga.field('name'),
            nga.field('description'),
            nga.field('category_id', 'reference').label('Category').targetEntity(category).targetField(nga.field('name')),
            nga.field('content', 'referenced_list').targetEntity(content).targetReferenceField('module_id').targetFields([nga.field('name')])
        ]);
        module.editionView().fields(module.creationView().fields());
        admin.addEntity(module);

        //Add content entity
        content.listView().fields([
            nga.field('name').isDetailLink(true),
            nga.field('description'),
            nga.field('status'),
            nga.field('type'),
            nga.field('module_id', 'reference').label('Module').targetEntity(module).targetField(nga.field('name'))
        ]);
        content.creationView().fields([
            nga.field('name'),
            nga.field('description'),
            nga.field('type', 'choice').choices([
                {label: 'Video', value : 'video'},
                {label: 'PDF', value : 'pdf'},
                {label: 'Game', value : 'game'},
                {label: 'Website', value : 'website'},
            ]),
            nga.field('path'),
            nga.field('module_id', 'reference').label('Module').targetEntity(module).targetField(nga.field('name'))
        ]);
        content.editionView().fields(content.creationView().fields());
        admin.addEntity(content);

        //Add playlist entity
        playlist.listView().fields([
            nga.field('name').isDetailLink(true),
            nga.field('description'),
            nga.field('status')
        ]);
        playlist.creationView().fields([
            nga.field('name'),
            nga.field('description'),
            nga.field('content', 'referenced_list').targetEntity(playlist_content).targetReferenceField('playlist_id').targetFields([nga.field('content_id', 'reference').label('Content').targetEntity(content).targetField(nga.field('name'))])
        ]);
        playlist.editionView().fields(playlist.creationView().fields());
        admin.addEntity(playlist);

        //Add playlist_content entity
        playlist_content.listView().fields([
            nga.field('playlist_id', 'reference').label('Playlist').targetEntity(playlist).targetField(nga.field('name')).isDetailLink(true).remoteComplete(true, {
                refreshDelay: 300,
                searchQuery: function(search) { return {name : {$like: '%' + search + '%'} }; }
            }).perPage(10),
            nga.field('content_id', 'reference').label('Content').targetEntity(content).targetField(nga.field('name')).remoteComplete(true, {
                refreshDelay: 300,
                searchQuery: function(search) { return {name : {$like: '%' + search + '%'} }; }
            }).perPage(10),
            nga.field('position', 'number').label('Position')
        ]);
        playlist_content.creationView().fields(playlist_content.listView().fields());
        playlist_content.editionView().fields(playlist_content.creationView().fields());
        admin.addEntity(playlist_content);

        //Add link to Sync page
        admin.menu().addChild(nga.menu()
            .title('Sync')
            .icon('<span class="fa fa-cog fa-fw"></span>')
            .link('/sync')
            .active(path => path.indexOf('/sync') === 0)
        );

        nga.configure(admin);


    }]);
