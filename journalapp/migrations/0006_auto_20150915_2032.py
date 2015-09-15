# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('journalapp', '0005_temporaryjournalpage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='journal',
            name='user',
            field=models.ForeignKey(to='journalapp.J_User', null=True),
        ),
    ]
