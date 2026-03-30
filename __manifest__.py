{
    "name": "POS Self Service Mode",
    "version": "19.0.1.0.0",
    "category": "Point of Sale",
    "summary": "Masque les boutons non nécessaires pour un usage client self-service",
    "description": """
        Module qui active un mode self-service pour le POS Odoo.
        Masque les boutons: Commandes, +, numéro de commande, Prix, Client, Note, menu actions.
        Le menu hamburger est protégé par un code PIN pour sortir du mode self-service.
    """,
    "author": "Custom",
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
    "installable": True,
    "license": "LGPL-3",
}
