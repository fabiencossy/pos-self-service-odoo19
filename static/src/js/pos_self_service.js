/** @odoo-module */

import { Navbar } from "@point_of_sale/app/components/navbar/navbar";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { NumberPopup } from "@point_of_sale/app/components/popups/number_popup/number_popup";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";

// Patch Navbar: add PIN-protected menu button for self-service mode
patch(Navbar.prototype, {
    async onSelfServiceMenuClick() {
        this.dialog.add(NumberPopup, {
            title: _t("Code PIN requis"),
            placeholder: _t("Entrez le code PIN"),
            startingValue: "",
            getPayload: (pin) => {
                if (String(pin) === String(this.pos.config.self_service_pin)) {
                    this._showSelfServiceMenu();
                } else {
                    this.notification.add(_t("Code PIN incorrect"), {
                        type: "danger",
                    });
                }
            },
        });
    },

    _showSelfServiceMenu() {
        this.dialog.add(ConfirmationDialog, {
            title: _t("Menu Self-Service"),
            body: _t("Que souhaitez-vous faire ?"),
            confirm: () => {
                this.pos.closePos();
            },
            confirmLabel: _t("Retour au backend"),
            cancel: () => {
                this.pos.closeSession();
            },
            cancelLabel: _t("Fermer la caisse"),
        });
    },
});

// Patch ProductScreen
patch(ProductScreen.prototype, {
    // Keep 4-column grid but hide Price, %, +/- buttons (invisible keeps grid space)
    getNumpadButtons() {
        if (!this.pos.config.self_service_mode) {
            return super.getNumpadButtons(...arguments);
        }
        return super.getNumpadButtons(...arguments).map((button) => {
            if (button.value === "price" || button.value === "discount" || button.value === "-") {
                return {
                    ...button,
                    disabled: true,
                    class: (button.class || "") + " invisible",
                };
            }
            return button;
        });
    },

    // Block long press on products (no product info/edit for clients)
    onMouseDown(event, product) {
        if (this.pos.config.self_service_mode) {
            return;
        }
        super.onMouseDown(event, product);
    },

    onTouchStart(product) {
        if (this.pos.config.self_service_mode) {
            return;
        }
        super.onTouchStart(product);
    },
});
