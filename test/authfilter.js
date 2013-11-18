var assert = require('chai').assert;
var authfilter = require('../');

describe('authfilter', function () {
    describe('white list mode', function () {
        var filter1 = authfilter.create({
            allow: true,
            deny: ['/private', /^\/sec.*$/i],
            check: function (req, res) {
                return false;
            },
            login: function (req, res) {
                res.redirect('/login');
            }
        });

        var filter2 = authfilter.create({
            deny: ['/private', /^\/sec.*$/i],
            check: function (req, res) {
                return false;
            },
            login: function (req, res) {
                res.redirect('/login');
            }
        });

        it('should allow public visit', function () {
            [
                '/public',
                '/private2',
                '/home',
                '/'
            ].forEach(function (url) {
                filter1({
                    url: url
                }, null, function () {
                    assert.ok(true, 'public visit is ok in white list mode');
                });
            });

            [
                '/public',
                '/private2',
                '/home',
                '/'
            ].forEach(function (url) {
                filter2({
                    url: url
                }, null, function () {
                    assert.ok(true, 'public visit is ok in white list mode');
                });
            });
        });

        it('should deny private visit', function () {
            [
                '/sec-private',
                '/private'
            ].forEach(function (url) {
                filter1({
                    url: url
                }, {
                    redirect: function (url) {
                        assert.equal(url, '/login', 'private visit will redirect to login page');
                    }
                });
            });

            [
                '/sec-private',
                '/private'
            ].forEach(function (url) {
                filter2({
                    url: url
                }, {
                    redirect: function (url) {
                        assert.equal(url, '/login', 'private visit will redirect to login page');
                    }
                });
            });
        });
    });

    describe('black list mode', function () {
        var filter1 = authfilter.create({
            deny: true,
            allow: ['/private', /^\/sec.*$/i],
            check: function (req, res) {
                return false;
            },
            login: function (req, res) {
                res.redirect('/login');
            }
        });

        var filter2 = authfilter.create({
            deny: true,
            allow: ['/private', /^\/sec.*$/i],
            check: function (req, res) {
                return false;
            },
            login: function (req, res) {
                res.redirect('/login');
            }
        });

        it('should allow public visit', function () {
            [
                '/private',
                '/sec-zone',
                '/sec-home',
                '/sec'
            ].forEach(function (url) {
                filter1({
                    url: url
                }, null, function () {
                    assert.ok(true, 'public visit is ok in white list mode');
                });

                filter2({
                    url: url
                }, null, function () {
                    assert.ok(true, 'public visit is ok in white list mode');
                });
            });
        });

        it('should deny private visit', function () {
            [
                '/public',
                '/home',
                '/'
            ].forEach(function (url) {
                filter1({
                    url: url
                }, {
                    redirect: function (url) {
                        assert.equal(url, '/login', 'private visit will redirect to login page');
                    }
                });
                filter2({
                    url: url
                }, {
                    redirect: function (url) {
                        assert.equal(url, '/login', 'private visit will redirect to login page');
                    }
                });
            });
        });
    });

    describe('norm mode', function () {
        var filter = authfilter.create({
            allow: [
                '/public',
                /^\/open.*$/i
            ],
            deny: [
                '/private',
                /^\/sec.*$/i
            ],
            check: function (req, res) {
                return false;
            },
            login: function (req, res) {
                res.redirect('/login');
            }
        });

        it('should allow public visit', function () {
            [
                '/public',
                '/open-home'
            ].forEach(function (url) {
                filter({
                    url: url
                }, null, function () {
                    assert.ok(true, 'public visit is ok in white list mode');
                });
            });
        });

        it('should deny private visit', function () {
            [
                '/private',
                '/sec-home'
            ].forEach(function (url) {
                filter({
                    url: url
                }, {
                    redirect: function (url) {
                        assert.equal(url, '/login', 'private visit will redirect to login page');
                    }
                });
            });
        });

        it('should raise expection when url not found', function () {
            assert.throw(function () {
                filter({
                    url: '/home'
                });
            }, 'URL not match');
        });
    });
});
