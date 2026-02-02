module.exports = {
  apps: [
    {
      name: 'tution-app-api',
      script: 'src/server.js',
      cwd: '/home/abhinav/tution-app/server/',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      // Development environment variables
      env: {
        NODE_ENV: 'development',
        // add dev-only vars if needed
      },

      // Production environment variables
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        DATABASE_URL: 'postgresql://tution_app_user:testpass123@localhost:5432/tution_app_db',
        CLERK_SECRET_KEY: 'sk_test_PYJsPAybFA8Fbx77bxNWb3VrPitZxB15OIY6hHk2kZ',
        CLERK_PUBLISHABLE_KEY: 'pk_test_PYJsPAybFA8Fbx77bxNWb3VrPitZxB15OIY6hHk2kZ',
        CLERK_WEBHOOK_SECRET: 'whsec_0hFHRigTqDq/JVkZ4avODXTEiRJWLnP4'
      }
    }
  ]
};
