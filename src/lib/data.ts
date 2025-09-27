import type { UserProfile, RoomListing, PreferenceOptions } from '@/lib/types';

export const preferenceOptions: PreferenceOptions = {
  budget: ['$500-800', '$800-1200', '$1200-1600', '$1600+'],
  sleepSchedule: ['Early Bird', 'Night Owl', 'Flexible'],
  cleanliness: ['Very Tidy', 'Moderately Tidy', 'Relaxed'],
  studyHabits: ['Quiet Study', 'Collaborative Study', 'Study with Music'],
  socialHabits: ['Often has guests', 'Occasional guests', 'Rarely has guests'],
};

export const users: UserProfile[] = [
  {
    id: 1,
    name: 'Alex',
    age: 21,
    university: 'Stanford University',
    avatarUrl: 'https://picsum.photos/seed/avatar1/200/200',
    bio: 'CS student who loves hiking and indie music. Looking for a friendly and respectful roommate.',
    preferences: {
      budget: '$1200-1600',
      sleepSchedule: 'Night Owl',
      cleanliness: 'Moderately Tidy',
      studyHabits: 'Study with Music',
      socialHabits: 'Occasional guests',
    },
  },
  {
    id: 2,
    name: 'Ben',
    age: 23,
    university: 'UC Berkeley',
    avatarUrl: 'https://picsum.photos/seed/avatar2/200/200',
    bio: 'Loves to cook and explore new cafes. I keep my space clean and appreciate a good chat.',
    preferences: {
      budget: '$1200-1600',
      sleepSchedule: 'Night Owl',
      cleanliness: 'Very Tidy',
      studyHabits: 'Quiet Study',
      socialHabits: 'Occasional guests',
    },
  },
  {
    id: 3,
    name: 'Chloe',
    age: 20,
    university: 'Stanford University',
    avatarUrl: 'https://picsum.photos/seed/avatar3/200/200',
    bio: 'Art history major. I enjoy painting, visiting museums, and quiet evenings with a book.',
    preferences: {
      budget: '$800-1200',
      sleepSchedule: 'Early Bird',
      cleanliness: 'Very Tidy',
      studyHabits: 'Quiet Study',
      socialHabits: 'Rarely has guests',
    },
  },
  {
    id: 4,
    name: 'David',
    age: 22,
    university: 'San Jose State',
    avatarUrl: 'https://picsum.photos/seed/avatar4/200/200',
    bio: 'Into gaming and basketball. Pretty laid back about most things, just want a chill place to live.',
    preferences: {
      budget: '$800-1200',
      sleepSchedule: 'Night Owl',
      cleanliness: 'Relaxed',
      studyHabits: 'Study with Music',
      socialHabits: 'Often has guests',
    },
  },
  {
    id: 5,
    name: 'Eva',
    age: 21,
    university: 'UC Berkeley',
    avatarUrl: 'https://picsum.photos/seed/avatar5/200/200',
    bio: 'Environmental science student. I am passionate about sustainability, yoga, and vegetarian cooking.',
    preferences: {
      budget: '$1600+',
      sleepSchedule: 'Early Bird',
      cleanliness: 'Moderately Tidy',
      studyHabits: 'Collaborative Study',
      socialHabits: 'Occasional guests',
    },
  },
  {
    id: 6,
    name: 'Frank',
    age: 24,
    university: 'Stanford University',
    avatarUrl: 'https://picsum.photos/seed/avatar6/200/200',
    bio: 'Med student, so I study a lot. Need a quiet and clean environment. I de-stress by running.',
    preferences: {
      budget: '$1600+',
      sleepSchedule: 'Early Bird',
      cleanliness: 'Very Tidy',
      studyHabits: 'Quiet Study',
      socialHabits: 'Rarely has guests',
    },
  },
];

export const currentUser: UserProfile = users[0];
export const potentialMatches: UserProfile[] = users.slice(1);

export const roomListings: RoomListing[] = [
    {
        id: 1,
        title: 'Modern 2-Bed near Campus',
        location: 'Palo Alto, CA',
        rent: 2800,
        availableRooms: 1,
        amenities: ['In-unit laundry', 'Gym', 'Pool', 'Parking'],
        images: ['https://picsum.photos/seed/room1/800/600', 'https://picsum.photos/seed/room2/800/600'],
        coordinates: { lat: 37.4419, lng: -122.1430 },
        description: 'Beautiful modern apartment just 5 minutes walk from Stanford University. Features hardwood floors, updated kitchen with stainless steel appliances, and a private balcony overlooking the courtyard.',
        propertyType: 'Apartment',
        size: '1200 sq ft',
        deposit: 2800,
    },
    {
        id: 2,
        title: 'Cozy Room in Berkeley',
        location: 'Berkeley, CA',
        rent: 1100,
        availableRooms: 1,
        amenities: ['Furnished', 'Utilities included', 'Near BART'],
        images: ['https://picsum.photos/seed/room3/800/600', 'https://picsum.photos/seed/room4/800/600'],
        coordinates: { lat: 37.8719, lng: -122.2585 },
        description: 'Charming room in a historic Berkeley home. Shared kitchen and living areas with friendly housemates. Perfect for students who want a community feel.',
        propertyType: 'House',
        size: '150 sq ft',
        deposit: 1100,
    },
    {
        id: 3,
        title: 'Spacious Downtown Apartment',
        location: 'San Jose, CA',
        rent: 1500,
        availableRooms: 2,
        amenities: ['Pet friendly', 'Balcony', 'Parking'],
        images: ['https://picsum.photos/seed/room5/800/600'],
        coordinates: { lat: 37.3382, lng: -121.8863 },
        description: 'Large apartment in the heart of downtown San Jose. Close to tech companies, restaurants, and nightlife. Pet-friendly building with on-site parking.',
        propertyType: 'Apartment',
        size: '900 sq ft',
        deposit: 1500,
    },
    {
        id: 4,
        title: 'Quiet Studio for Students',
        location: 'Palo Alto, CA',
        rent: 1800,
        availableRooms: 1,
        amenities: ['In-unit laundry', 'Furnished', 'A/C'],
        images: ['https://picsum.photos/seed/room1/800/600'],
        coordinates: { lat: 37.4419, lng: -122.1430 },
        description: 'Perfect studio apartment for focused students. Quiet building with excellent study environment. All utilities included except internet.',
        propertyType: 'Studio',
        size: '400 sq ft',
        deposit: 1800,
    },
];

export const matchedUsers: UserProfile[] = [users[1], users[4]];

export const chatMessages = {
  '2': [
    { from: 'them', text: 'Hey Alex! Saw we matched. Your profile seems cool, I am also into indie music!' },
    { from: 'me', text: "Hey Ben! Awesome. Yeah, looks like we've got a lot in common. Good taste in music haha." },
    { from: 'them', text: 'For sure! You free to chat about potentially rooming together sometime this week?' },
  ],
  '5': [
    { from: 'them', text: "Hi Alex, we matched on RoomHarmony. I'm Eva." },
  ],
};
