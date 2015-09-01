# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('journalapp', '0002_auto_20150901_2125'),
    ]

    operations = [
        migrations.CreateModel(
            name='PageImage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('images', models.ManyToManyField(to='journalapp.Image', blank=True)),
                ('page', models.OneToOneField(to='journalapp.Page')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
