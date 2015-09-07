# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('journalapp', '0003_pageimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='page',
            name='text',
            field=models.TextField(blank=True),
        ),
    ]
