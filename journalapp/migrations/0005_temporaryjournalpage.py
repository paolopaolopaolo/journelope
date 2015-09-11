# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('journalapp', '0004_auto_20150907_0019'),
    ]

    operations = [
        migrations.CreateModel(
            name='TemporaryJournalPage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('random_hash', models.CharField(max_length=20)),
                ('text', models.TextField()),
                ('images', models.ManyToManyField(to='journalapp.Image', blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
