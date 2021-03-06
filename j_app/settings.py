"""
Django settings for j_app project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os, pdb

try:
    from j_app.local_settings import *
except ImportError:
    # SECURITY WARNING: don't run with debug turned on in production!
    DEBUG = False
    TEMPLATE_DEBUG = False
    ALLOWED_HOSTS = [
                        '*',
                        '.journelope.com',
                        '.journelope.com'
                    ]


BASE_DIR = os.path.dirname(os.path.dirname(__file__))
LOGIN_URL = "/uauth"
TEMPLATE_DIRS = (os.path.join(BASE_DIR, "templates"),)

STATICFILES_DIRS = (
    os.path.abspath(os.path.join(BASE_DIR, 'static')), 
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/
if DEBUG:
    with open(os.path.join(BASE_DIR, 'SECRET_KEY.txt'), 'rb') as secret_key:
        SECRET_KEY = secret_key.read()

    # Database
    # https://docs.djangoproject.com/en/1.7/ref/settings/#databases
    DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }
    
else:
    # with open(os.path.join(BASE_DIR, 'SECRET_KEY.txt'), 'rb') as secret_key:
    #     SECRET_KEY = secret_key.read()
    SECRET_KEY = os.environ['JAPP_SK']

    # Database
    # https://docs.djangoproject.com/en/1.7/ref/settings/#databases
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.environ['JAPP_DB_NAME'],
            'HOST': os.environ['JAPP_DB_HOST'],
            'USER': os.environ['JAPP_DB_USER'],
            'PASSWORD': os.environ['JAPP_DB_PASSWORD'],
            'PORT': os.environ['JAPP_DB_PORT'],
        }
    }

    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    ADMINS = (('Dean', 'dpaolomercado@gmail.com'),)


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(os.path.dirname(os.path.abspath(BASE_DIR)), "static_root")

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(os.path.dirname(os.path.abspath(BASE_DIR)), "media_root")


COMPRESS_ENABLED = True
COMPRESS_OFFLINE = False
COMPRESS_PRECOMPILERS = (
    ('text/less', 'lessc {infile} {outfile}'),
)
COMPRESS_JS_FILTERS = []

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'mod_wsgi.server',
    'compressor',
    'rest_framework',
    'journalapp'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'j_app.urls'

WSGI_APPLICATION = 'j_app.wsgi.application'


# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True



