# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('journalapp', '0007_temporaryjournalpage_journal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='temporaryjournalpage',
            name='guid',
            field=models.CharField(max_length=30),
        ),
    ]
