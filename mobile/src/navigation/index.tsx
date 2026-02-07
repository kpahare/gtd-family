import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

import { useAuthStore } from '../store';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

// Main Screens
import { InboxScreen } from '../screens/inbox/InboxScreen';
import { ProcessItemScreen } from '../screens/inbox/ProcessItemScreen';
import { NextActionsScreen } from '../screens/lists/NextActionsScreen';
import { WaitingForScreen } from '../screens/lists/WaitingForScreen';
import { SomedayScreen } from '../screens/lists/SomedayScreen';
import { ProjectsScreen } from '../screens/projects/ProjectsScreen';
import { ProjectDetailScreen } from '../screens/projects/ProjectDetailScreen';
import { ContextsScreen } from '../screens/contexts/ContextsScreen';
import { FamilyScreen } from '../screens/family/FamilyScreen';
import { WeeklyReviewScreen } from '../screens/review/WeeklyReviewScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ListsStack = createNativeStackNavigator();
const ProjectsStack = createNativeStackNavigator();
const InboxStack = createNativeStackNavigator();

function InboxStackNavigator() {
  return (
    <InboxStack.Navigator>
      <InboxStack.Screen
        name="InboxMain"
        component={InboxScreen}
        options={{ title: 'Inbox' }}
      />
      <InboxStack.Screen
        name="ProcessItem"
        component={ProcessItemScreen}
        options={{ title: 'Process Item' }}
      />
    </InboxStack.Navigator>
  );
}

function ListsStackNavigator() {
  return (
    <ListsStack.Navigator>
      <ListsStack.Screen
        name="NextActions"
        component={NextActionsScreen}
        options={{ title: 'Next Actions' }}
      />
      <ListsStack.Screen
        name="WaitingFor"
        component={WaitingForScreen}
        options={{ title: 'Waiting For' }}
      />
      <ListsStack.Screen
        name="Someday"
        component={SomedayScreen}
        options={{ title: 'Someday/Maybe' }}
      />
    </ListsStack.Navigator>
  );
}

function ProjectsStackNavigator() {
  return (
    <ProjectsStack.Navigator>
      <ProjectsStack.Screen
        name="ProjectsList"
        component={ProjectsScreen}
        options={{ title: 'Projects' }}
      />
      <ProjectsStack.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={{ title: 'Project' }}
      />
    </ProjectsStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Inbox':
              iconName = focused ? 'mail' : 'mail-outline';
              break;
            case 'Lists':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Projects':
              iconName = focused ? 'folder' : 'folder-outline';
              break;
            case 'Contexts':
              iconName = focused ? 'location' : 'location-outline';
              break;
            case 'Review':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'More':
              iconName = focused ? 'menu' : 'menu-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inbox" component={InboxStackNavigator} />
      <Tab.Screen name="Lists" component={ListsStackNavigator} />
      <Tab.Screen name="Projects" component={ProjectsStackNavigator} />
      <Tab.Screen name="Contexts" component={ContextsScreen} />
      <Tab.Screen name="Review" component={WeeklyReviewScreen} />
      <Tab.Screen name="More" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Family"
        component={FamilyScreen}
        options={{ title: 'Family' }}
      />
    </Stack.Navigator>
  );
}

export function Navigation() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
