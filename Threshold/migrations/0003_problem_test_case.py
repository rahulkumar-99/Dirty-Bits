# Generated by Django 3.0.5 on 2020-05-06 13:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Threshold', '0002_auto_20190729_1356'),
    ]

    operations = [
        migrations.AddField(
            model_name='problem',
            name='test_case',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
    ]