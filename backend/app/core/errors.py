class AppError(Exception):
    pass

class ConfigError(AppError):
    pass

class ProviderError(AppError):
    pass