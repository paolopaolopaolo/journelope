# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import journalapp.models


class Migration(migrations.Migration):

    dependencies = [
        ('journalapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('imageFile', models.ImageField(upload_to=journalapp.models.upload_image)),
                ('top', models.FloatField(default=0.0)),
                ('left', models.FloatField(default=0.0)),
                ('width', models.FloatField(default=0.0)),
                ('height', models.FloatField(default=0.0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Journal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateTimeField(auto_now=True)),
                ('textFilename', models.CharField(max_length=200)),
                ('order', models.IntegerField(default=1)),
                ('public', models.BooleanField(default=False)),
                ('user', models.ForeignKey(to='journalapp.J_User')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateTimeField(auto_now=True)),
                ('text', models.TextField()),
                ('scrollpos', models.IntegerField(default=0)),
                ('journal', models.ForeignKey(to='journalapp.Journal')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='image',
            name='page',
            field=models.ForeignKey(to='journalapp.Page'),
            preserve_default=True,
        ),
    ]
