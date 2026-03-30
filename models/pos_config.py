from odoo import fields, models


class PosConfig(models.Model):
    _inherit = "pos.config"

    self_service_mode = fields.Boolean(
        string="Mode Self-Service",
        default=False,
        help="Active le mode self-service qui masque les boutons non nécessaires pour les clients.",
    )
    self_service_pin = fields.Char(
        string="Code PIN Self-Service",
        default="1234",
        help="Code PIN requis pour accéder au menu et sortir du mode self-service.",
    )
