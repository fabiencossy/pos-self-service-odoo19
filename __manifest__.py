{
    "name": "POS Self Service Mode",
    "version": "19.0.1.0.0",
    "category": "Point of Sale",
    "summary": "Mode self-service pour le POS: masque les boutons inutiles, protège le menu par PIN",
    "description": """
POS Self Service Mode
=====================

Transforme le Point de Vente Odoo en borne self-service client.
Compatible Odoo Online / SaaS (aucun code Python).

Activation: ouvrir le POS, taper le code PIN par défaut (1234) sur le bouton menu,
puis sélectionner "Activer/Désactiver Self-Service".
    """,
    "author": "Qodo Digital",
    "website": "https://github.com/fabiencossy/pos-self-service-odoo19",
    "depends": ["point_of_sale"],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_self_service/static/src/css/pos_self_service.css",
            "pos_self_service/static/src/js/pos_self_service.js",
            "pos_self_service/static/src/js/navbar_patch.xml",
        ],
    },
    "installable": True,
    "auto_install": False,
    "application": False,
    "license": "LGPL-3",
}
