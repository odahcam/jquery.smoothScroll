/**
 * smoothScroll plugin.
 *
 * To make your anchor links look fancy.
 *
 * @author Luiz Filipe Machado Barni <luiz@odahcam.com>
 * @version 1.0.0
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */;(function ($, window, document, undefined) {

    if (!$) {
        console.error("jQuery not found. Please make sure to import jQuery berofe importing the plugin.");
        return false;
    }

    /**
     * Store the plugin name in a variable. It helps you if later decide to
     * change the plugin's name
     * @type {String}
     */
    var pluginName = 'smoothScroll',
        // plugin default options
        defaults = {
            // @TODO: use elements to disccount for fixing horizontal fixed element height problems.
            fixedHeader: '#header, body>header, header.main, #header-main', // stores the document header selector
            easing: 'swing', // easing type
            duration: 'auto', // int (in ms) or 'auto', that will use speed
            speed: 1600, // 1600 pixels per second
        };

    /**
     * The plugin constructor
     * @param {object} element The DOM element where plugin is applied
     * @param {object} options Options passed to the constructor
     */
    function Plugin(element, options) {

        // Store a reference to the source element
        this.el = element;

        // Store a jQuery reference to the source element
        this.$el = $(element);

        // Store a jQuery reference to the source element
        this.$target = $(this.$el.data('scrollTarget') || "#" + this.el.href.replace(/^.*#/g, ''));

        // Set the instance options extending the plugin defaults and
        // the options passed by the user
        this.settings = $.extend(false, {}, defaults, options);

        this.$fixedHeader = $(this.settings.fixedHeader);

        // Initialize the plugin instance
        this.init();
    }

    /**
     * Set up your Plugin prototype with desired methods.
     * It is a good practice to implement 'init' and 'destroy' methods.
     */
    Plugin.prototype = {
        /**
         * Initialize the plugin instance.
         * Set any other attribtes, store any other element reference, register
         * listeners, etc
         *
         * When bind listerners remember to name tag it with your plugin's name.
         * Elements can have more than one listener attached to the same event
         * so you need to tag it to unbind the appropriate listener on destroy:
         *
         * @example
         * this.$someSubElement.on('click.' + pluginName, function() {
         *      // Do something
         * });
         *
         */
        init: function () {

            var plugin = this;

            plugin.$el.on("click." + pluginName, function (e) {
                e.preventDefault();

                plugin._scrollTo(plugin.$target, plugin.settings.duration);
            });

        },
        /**
         * The 'destroy' method is were you free the resources used by your plugin:
         * references, unregister listeners, etc.
         *
         * Remember to unbind for your event:
         *
         * @example
         * this.$someSubElement.off('.' + pluginName);
         *
         * Above example will remove any listener from your plugin for on the given
         * element.
         */
        destroy: function () {

            // Remove any attached data from your plugin
            this.$el.removeData();

            // Remove Listenners
            this.$el.off('.' + pluginName);
        },
        /**
         * @description Scrolls the page to the element desired, based on Header's height.
         *
         * @param {elem} elem jQuery object
         * @param {int} duration
         *
         * @returns {void}
         */
        _scrollTo: function ($elem, duration) {

            $elem = $elem || $(document.body);
            
            var plugin = this;
            var headerHeight = this.$fixedHeader.height();
            var target = Math.floor(($elem.offset().top || 0) - headerHeight || 0);

            if (typeof duration !== 'number') {
                var distance = Math.abs($(window).scrollTop() - target);
                duration = Math.round(distance / this.settings.speed * 1000); // X pixels / 300 pixels/second * 1000 ms
            }
            
            var $page = $("html, body");

            $page
                .stop()
                .on('scroll.scrollHere mousedown.scrollHere wheel.scrollHere DOMMouseScroll.scrollHere mousewheel.scrollHere keyup.scrollHere touchmove.scrollHere', function () {
                    $page.stop();
                })
                .animate({
                    scrollTop: location
                }, duration, this.settings.easing, function () {
                    $page.off('scrollHere');
                
                    if (headerHeight !== plugin.$fixedHeader.height()) {
                        plugin._scrollTo($elem, '');
                    }
                });
        }
    };

    /**
     * This is a real private method. A plugin instance has access to it
     * @return {[type]}
     */
    /* var privateMethod = function () {
        console.log("privateMethod");
        console.log(this);
    };*/

    /**
     * This is were we register our plugin withint jQuery plugins.
     * It is a plugin wrapper around the constructor and prevents agains multiple
     * plugin instantiation (soteing a plugin reference within the element's data)
     * and avoid any function starting with an underscore to be called (emulating
     * private functions).
     *
     * @example
     * $('#element').jqueryPlugin({
     *     defaultOption: 'this options overrides a default plugin option',
     *     additionalOption: 'this is a new option'
     * });
     */

    /**
     * @author Luiz Filipe Machado Barni <luiz@h2k.com.br>
     * @description This plugin will help you to create a fixed header menu, highlight it's links and smooth scroll when a internal link is clicked.
     * @param {object} options
     *
     * @example
     * $('#element').fixedHeader({
     *     scrollSpy: false
     * });
     */
    $.fn[pluginName] = function (options) {

        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            /*
             * Creates a new plugin instance, for each selected element, and
             * stores a reference withint the element's data
             */
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options !== 'init') {
            /*
             * Call a public plugin method for each selected element and returns this to not break chainbility.
             */
            return this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    return instance[options].apply(instance, Array.prototype.slice.call(args, 1)); // Array.prototype.slice will convert the arguments object
                }
            });
        }
    };

})(window.jQuery || false, window, document);
