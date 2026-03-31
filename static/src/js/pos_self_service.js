/** @odoo-module */

import { Navbar } from "@point_of_sale/app/components/navbar/navbar";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { NumberPopup } from "@point_of_sale/app/components/popups/number_popup/number_popup";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";

// Default PIN code - can be changed via the self-service menu
const SELF_SERVICE_DEFAULT_PIN = "1234";

// Self-service state stored in localStorage (persists per browser)
function isSelfServiceActive() {
    return localStorage.getItem("pos_self_service_mode") === "true";
}

function setSelfServiceActive(active) {
    localStorage.setItem("pos_self_service_mode", active ? "true" : "false");
}

function getSelfServicePin() {
    return localStorage.getItem("pos_self_service_pin") || SELF_SERVICE_DEFAULT_PIN;
}

function setSelfServicePin(pin) {
    localStorage.setItem("pos_self_service_pin", pin);
}

// Patch Navbar
patch(Navbar.prototype, {
    setup() {
        super.setup(...arguments);
        // Apply self-service class on startup
        this._applySelfServiceClass();
    },

    _applySelfServiceClass() {
        const root = document.querySelector(".pos");
        if (root) {
            if (isSelfServiceActive()) {
                root.classList.add("pos-self-service");
            } else {
                root.classList.remove("pos-self-service");
            }
        }
    },

    async onSelfServiceMenuClick() {
        this.dialog.add(NumberPopup, {
            title: _t("Code PIN requis"),
            placeholder: _t("Entrez le code PIN"),
            startingValue: "",
            getPayload: (pin) => {
                if (String(pin) === getSelfServicePin()) {
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
        const isActive = isSelfServiceActive();
        this.dialog.add(ConfirmationDialog, {
            title: _t("Menu Self-Service"),
            body: isActive
                ? _t("Le mode self-service est activé. Que souhaitez-vous faire ?")
                : _t("Le mode self-service est désactivé. Que souhaitez-vous faire ?"),
            confirm: () => {
                setSelfServiceActive(!isActive);
                this._applySelfServiceClass();
                this.notification.add(
                    isActive
                        ? _t("Mode self-service désactivé")
                        : _t("Mode self-service activé"),
                    { type: "info" }
                );
            },
            confirmLabel: isActive
                ? _t("Désactiver Self-Service")
                : _t("Activer Self-Service"),
            cancel: () => {
                this._showExitMenu();
            },
            cancelLabel: _t("Changer PIN / Quitter"),
        });
    },

    _showExitMenu() {
        this.dialog.add(ConfirmationDialog, {
            title: _t("Options"),
            body: _t("Choisissez une action :"),
            confirm: () => {
                this.dialog.add(NumberPopup, {
                    title: _t("Nouveau code PIN"),
                    placeholder: _t("Entrez le nouveau PIN"),
                    startingValue: "",
                    getPayload: (newPin) => {
                        if (newPin && String(newPin).length >= 4) {
                            setSelfServicePin(String(newPin));
                            this.notification.add(_t("Code PIN mis à jour"), {
                                type: "success",
                            });
                        } else {
                            this.notification.add(
                                _t("PIN trop court (min 4 chiffres)"),
                                { type: "danger" }
                            );
                        }
                    },
                });
            },
            confirmLabel: _t("Changer le PIN"),
            cancel: () => {
                this.pos.closePos();
            },
            cancelLabel: _t("Retour au backend"),
        });
    },
});

// Patch ProductScreen
patch(ProductScreen.prototype, {
    // Hide Price/Discount/+/- buttons in self-service mode
    getNumpadButtons() {
        if (!isSelfServiceActive()) {
            return super.getNumpadButtons(...arguments);
        }
        return super.getNumpadButtons(...arguments).map((button) => {
            if (button.value === "price" || button.value === "discount" || button.value === "-") {
                return {
                    ...button,
                    disabled: true,
                    class: (button.class || "") + " o_self_service_hidden_btn",
                };
            }
            return button;
        });
    },

    // Block long press on products (no product info/edit for clients)
    onMouseDown(event, product) {
        if (isSelfServiceActive()) {
            return;
        }
        super.onMouseDown(event, product);
    },

    onTouchStart(product) {
        if (isSelfServiceActive()) {
            return;
        }
        super.onTouchStart(product);
    },
});
