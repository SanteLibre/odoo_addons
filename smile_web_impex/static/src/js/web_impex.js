odoo.define('web_impex', function (require) {
    'use strict';

    var core = require("web.core");
    var Sidebar = require('web.Sidebar');
    var KanbanController = require('web.KanbanController');
    var ListController = require("web.ListController");
    var _t = core._t;
    var session = require("web.session");

    KanbanController.include({
        /**
         * Hide "Import" button if user has no Import group.
         */
        renderButtons: function () {
            this._super.apply(this, arguments); // Sets this.$buttons

            var has_import_group = session.has_group_smile_import;
            if (!has_import_group && this.$buttons !== undefined) {
                this.$buttons.find('.o_button_import').hide();
            }
        },
    });

    ListController.include({

        /**
         * Hide "Import" button if user has no Import group.
         */
        renderButtons: function () {
            this._super.apply(this, arguments); // Sets this.$buttons

            var has_import_group = session.has_group_smile_import;
            if (!has_import_group && this.$buttons !== undefined) {
                this.$buttons.find('.o_button_import').hide();
            }
        },

        /**
         * Hide "Export" action if user has no Export group.
         */
        renderSidebar: function ($node) {
            if (this.hasSidebar && !this.sidebar) {
                var other = [];

                var has_export_group = session.has_group_smile_export;
                if (has_export_group) {
                    other.push({
                        label: _t("Export"),
                        callback: this._onExportData.bind(this)
                    });
                }

                if (this.archiveEnabled) {
                    other.push({
                        label: _t("Archive"),
                        callback: this._onToggleArchiveState.bind(this, true)
                    });
                    other.push({
                        label: _t("Unarchive"),
                        callback: this._onToggleArchiveState.bind(this, false)
                    });
                }
                if (this.is_action_enabled('delete')) {
                    other.push({
                        label: _t('Delete'),
                        callback: this._onDeleteSelectedRecords.bind(this)
                    });
                }
                this.sidebar = new Sidebar(this, {
                    editable: this.is_action_enabled('edit'),
                    env: {
                        context: this.model.get(this.handle, {raw: true}).getContext(),
                        activeIds: this.getSelectedIds(),
                        model: this.modelName,
                    },
                    actions: _.extend(this.toolbarActions, {other: other}),
                });
                this.sidebar.appendTo($node);

                this._toggleSidebar();
            }
        }
    });

});
