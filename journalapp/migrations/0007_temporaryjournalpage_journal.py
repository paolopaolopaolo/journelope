# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('journalapp', '0006_auto_20150915_2032'),
    ]

    operations = [
        migrations.AddField(
            model_name='temporaryjournalpage',
            name='journal',
            field=models.OneToOneField(default='', to='journalapp.Journal'),
            preserve_default=False,
        ),
    ]
