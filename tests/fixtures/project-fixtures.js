/**
 * Test Project Fixtures for Different Frameworks
 * Provides mock project structures for testing advanced web development commands
 */

const path = require('path');
const fs = require('fs').promises;

class ProjectFixtures {
  constructor() {
    this.fixturesDir = path.join(__dirname, 'mock-projects');
  }

  /**
   * Get React project fixture
   */
  getReactProject() {
    return {
      name: 'react-app',
      type: 'react',
      structure: {
        'package.json': {
          name: 'react-test-app',
          version: '1.0.0',
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
            'react-router-dom': '^6.8.0',
            axios: '^1.3.0'
          },
          devDependencies: {
            '@testing-library/react': '^13.4.0',
            '@testing-library/jest-dom': '^5.16.5',
            '@types/react': '^18.0.28',
            typescript: '^4.9.5',
            webpack: '^5.75.0',
            'webpack-bundle-analyzer': '^4.8.0'
          },
          scripts: {
            start: 'react-scripts start',
            build: 'react-scripts build',
            test: 'react-scripts test',
            eject: 'react-scripts eject'
          }
        },
        'src/': {
          'App.tsx': `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
          `,
          'index.tsx': `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
          `,
          'components/': {
            'Home.tsx': `
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
            `,
            'About.tsx': `
import React from 'react';

const About: React.FC = () => {
  return (
    <div>
      <h1>About</h1>
      <p>This is a test React application.</p>
    </div>
  );
};

export default About;
            `
          }
        },
        'public/': {
          'index.html': `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React Test App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
          `
        },
        'tsconfig.json': {
          compilerOptions: {
            target: 'es5',
            lib: ['dom', 'dom.iterable', 'es6'],
            allowJs: true,
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            moduleResolution: 'node',
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx'
          },
          include: ['src']
        }
      },
      expectedAnalysis: {
        projectType: 'react',
        frameworks: ['React'],
        languages: ['TypeScript', 'JavaScript'],
        buildTools: ['webpack'],
        testingFrameworks: ['@testing-library/react']
      }
    };
  }

  /**
   * Get Vue project fixture
   */
  getVueProject() {
    return {
      name: 'vue-app',
      type: 'vue',
      structure: {
        'package.json': {
          name: 'vue-test-app',
          version: '1.0.0',
          dependencies: {
            vue: '^3.2.47',
            'vue-router': '^4.1.6',
            vuex: '^4.1.0',
            axios: '^1.3.0'
          },
          devDependencies: {
            '@vue/cli-service': '^5.0.8',
            '@vue/test-utils': '^2.3.0',
            '@typescript-eslint/eslint-plugin': '^5.57.0',
            typescript: '^4.9.5',
            vite: '^4.2.0'
          },
          scripts: {
            serve: 'vue-cli-service serve',
            build: 'vue-cli-service build',
            test: 'vue-cli-service test:unit'
          }
        },
        'src/': {
          'App.vue': `
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
          `,
          'main.ts': `
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

createApp(App).use(store).use(router).mount('#app');
          `,
          'views/': {
            'Home.vue': `
<template>
  <div class="home">
    <h1>Home</h1>
    <div v-if="loading">Loading users...</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

export default defineComponent({
  name: 'Home',
  setup() {
    const users = ref<User[]>([]);
    const loading = ref(true);

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        users.value = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      loading
    };
  }
});
</script>
            `
          }
        },
        'vue.config.js': `
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }
});
        `
      },
      expectedAnalysis: {
        projectType: 'vue',
        frameworks: ['Vue'],
        languages: ['TypeScript', 'JavaScript'],
        buildTools: ['vite'],
        testingFrameworks: ['@vue/test-utils']
      }
    };
  }

  /**
   * Get Node.js/Express project fixture
   */
  getNodeExpressProject() {
    return {
      name: 'express-api',
      type: 'express',
      structure: {
        'package.json': {
          name: 'express-test-api',
          version: '1.0.0',
          main: 'server.js',
          dependencies: {
            express: '^4.18.2',
            mongoose: '^7.0.3',
            cors: '^2.8.5',
            helmet: '^6.1.5',
            'express-rate-limit': '^6.7.0',
            bcryptjs: '^2.4.3',
            jsonwebtoken: '^9.0.0',
            dotenv: '^16.0.3'
          },
          devDependencies: {
            nodemon: '^2.0.22',
            jest: '^29.5.0',
            supertest: '^6.3.3',
            '@types/express': '^4.17.17',
            '@types/jest': '^29.5.0',
            typescript: '^5.0.2'
          },
          scripts: {
            start: 'node server.js',
            dev: 'nodemon server.js',
            test: 'jest',
            'test:watch': 'jest --watch'
          }
        },
        'server.js': `
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;
        `,
        'routes/': {
          'users.js': `
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/users
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
          `
        },
        'models/': {
          'User.js': `
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
          `
        },
        'Dockerfile': `
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
        `,
        '.env.example': `
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/testdb
JWT_SECRET=your-secret-key
        `
      },
      expectedAnalysis: {
        projectType: 'express',
        frameworks: ['Express'],
        languages: ['JavaScript'],
        databases: ['MongoDB'],
        testingFrameworks: ['jest', 'supertest']
      }
    };
  }

  /**
   * Get Angular project fixture
   */
  getAngularProject() {
    return {
      name: 'angular-app',
      type: 'angular',
      structure: {
        'package.json': {
          name: 'angular-test-app',
          version: '1.0.0',
          dependencies: {
            '@angular/animations': '^15.2.0',
            '@angular/common': '^15.2.0',
            '@angular/compiler': '^15.2.0',
            '@angular/core': '^15.2.0',
            '@angular/forms': '^15.2.0',
            '@angular/platform-browser': '^15.2.0',
            '@angular/platform-browser-dynamic': '^15.2.0',
            '@angular/router': '^15.2.0',
            rxjs: '~7.8.0',
            tslib: '^2.3.0',
            'zone.js': '~0.12.0'
          },
          devDependencies: {
            '@angular-devkit/build-angular': '^15.2.0',
            '@angular/cli': '~15.2.0',
            '@angular/compiler-cli': '^15.2.0',
            '@types/jasmine': '~4.3.0',
            '@types/node': '^18.14.2',
            jasmine: '~4.5.0',
            karma: '~6.4.0',
            'karma-chrome-headless': '~3.1.0',
            'karma-coverage': '~2.2.0',
            typescript: '~4.9.4'
          },
          scripts: {
            ng: 'ng',
            start: 'ng serve',
            build: 'ng build',
            test: 'ng test',
            lint: 'ng lint'
          }
        },
        'angular.json': {
          version: 1,
          newProjectRoot: 'projects',
          projects: {
            'angular-test-app': {
              projectType: 'application',
              schematics: {},
              root: '',
              sourceRoot: 'src',
              prefix: 'app',
              architect: {
                build: {
                  builder: '@angular-devkit/build-angular:browser',
                  options: {
                    outputPath: 'dist/angular-test-app',
                    index: 'src/index.html',
                    main: 'src/main.ts',
                    polyfills: 'src/polyfills.ts',
                    tsConfig: 'tsconfig.app.json'
                  }
                }
              }
            }
          }
        },
        'src/': {
          'app/': {
            'app.component.ts': `
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-test-app';
}
            `,
            'app.module.ts': `
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
            `,
            'services/': {
              'user.service.ts': `
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`);
  }
}
              `
            }
          }
        }
      },
      expectedAnalysis: {
        projectType: 'angular',
        frameworks: ['Angular'],
        languages: ['TypeScript'],
        testingFrameworks: ['jasmine', 'karma']
      }
    };
  }

  /**
   * Create mock project files in filesystem for testing
   */
  async createMockProject(fixture, targetDir) {
    await this.createStructureRecursive(fixture.structure, targetDir);
    return targetDir;
  }

  /**
   * Clean up mock project files
   */
  async cleanupMockProject(projectDir) {
    try {
      await fs.rmdir(projectDir, { recursive: true });
    } catch (error) {
      console.warn(`Failed to cleanup mock project: ${error.message}`);
    }
  }

  /**
   * Get all available fixtures
   */
  getAllFixtures() {
    return {
      react: this.getReactProject(),
      vue: this.getVueProject(),
      express: this.getNodeExpressProject(),
      angular: this.getAngularProject()
    };
  }

  /**
   * Get fixture by type
   */
  getFixture(type) {
    const fixtures = this.getAllFixtures();
    return fixtures[type] || null;
  }

  // Private helper methods
  async createStructureRecursive(structure, basePath) {
    await fs.mkdir(basePath, { recursive: true });

    for (const [name, content] of Object.entries(structure)) {
      const fullPath = path.join(basePath, name);

      if (name.endsWith('/')) {
        // Directory
        const dirName = name.slice(0, -1);
        const dirPath = path.join(basePath, dirName);
        await fs.mkdir(dirPath, { recursive: true });
        await this.createStructureRecursive(content, dirPath);
      } else if (typeof content === 'object' && content !== null) {
        // JSON file
        await fs.writeFile(fullPath, JSON.stringify(content, null, 2));
      } else {
        // Text file
        await fs.writeFile(fullPath, content.trim());
      }
    }
  }
}

module.exports = ProjectFixtures;