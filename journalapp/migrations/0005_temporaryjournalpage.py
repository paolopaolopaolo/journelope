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
                ('guid', models.CharField(max_length=20)),
                ('pageimage', models.OneToOneField(to='journalapp.PageImage')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
