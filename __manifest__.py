{
    "name": "POS Self Service Mode",
    "version": "19.0.1.0.0",
    "category": "Point of Sale",
    "summary": "Mode self-service pour le POS: masque les boutons inutiles, protège le menu par PIN",
    "description": """
POS Self Service Mode
=====================

Module qui transforme le Point de Vente Odoo en borne self-service client.

Fonctionnalités:
- Masque les boutons Register, Commandes, onglets de commandes
- Masque les boutons Client, Note, menu actions (trois points)
- Masque les boutons Prix, Remise et +/- du numpad
- Bloque l'appui long sur les produits (pas d'édition)
- Remplace le menu hamburger par un bouton protégé par code PIN
- Affiche un message "Nous ne rendons pas la monnaie" sur l'écran de paiement

Configuration:
- Point de Vente > Configuration > onglet "Self-Service"
- Activer le mode et définir le code PIN (défaut: 1234)
    """,
    "author": "Qodo Digital",
    "website": "https://github.com/fabiencossy/pos-self-service-odoo19",
    "depends": ["point_of_sale"],
    "data": [
        "views/pos_config_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_self_service/static/src/css/pos_self_service.css",
            "pos_self_service/static/src/js/pos_self_service.js",
            "pos_self_service/static/src/js/navbar_patch.xml",
        ],
    },
    "images": [
        "static/description/icon.png",
    ],
    "installable": True,
    "auto_install": False,
    "application": False,
    "license": "LGPL-3",
}
