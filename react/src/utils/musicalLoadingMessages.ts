// Musical loading messages for Fidelis Audio
// Sincere, grounded messages that honor music as essential to life

const MUSICAL_LOADING_MESSAGES = [
  // Classic Rock
  "Well it's a one for the money, two for the show...",
  "I can't get no satisfaction...",
  "We will, we will rock you...",
  "Don't stop believin'...",
  "Another one bites the dust...",
  "Welcome to the Hotel California...",
  "Sweet Caroline, bah bah bah...",
  "Dancing Queen, young and sweet...",
  "Bohemian Rhapsody...",
  "Stairway to Heaven...",
  
  // Jazz Standards
  "Fly me to the moon...",
  "The way you look tonight...",
  "Summertime, and the livin' is easy...",
  "Autumn leaves are falling down...",
  "Take five...",
  "Blue moon, you saw me standing alone...",
  "What a wonderful world...",
  "Misty...",
  "Georgia on my mind...",
  "All of me...",
  
  // Folk/Dylan
  "How does it feel, to be without a home...",
  "The answer my friend is blowin' in the wind...",
  "The times they are a-changin'...",
  "Like a rolling stone...",
  "Tangled up in blue...",
  "Mr. Tambourine Man...",
  "Knockin' on heaven's door...",
  
  // Soul/Motown
  "My girl, talkin' 'bout my girl...",
  "I heard it through the grapevine...",
  "Dancing in the street...",
  "What's going on...",
  "Respect, find out what it means to me...",
  "Superstition ain't the way...",
  "I feel good, I knew that I would...",
  "Stand by me...",
  
  // Beatles
  "Here comes the sun, doo-doo-doo-doo...",
  "Yesterday, all my troubles seemed so far away...",
  "Let it be...",
  "Come together, right now...",
  "Hey Jude, don't be afraid...",
  "All you need is love...",
  "Here, there and everywhere...",
  
  // Country
  "I walk the line...",
  "Crazy, I'm crazy for feeling so lonely...",
  "On the road again...",
  "Sweet dreams of you...",
  "Ring of fire...",
  "Friends in low places...",
  
  // Hip-Hop/Rap
  "Started from the bottom now we're here...",
  "Lose yourself in the music...",
  "It was all a dream...",
  "Can't touch this...",
  
  // Pop
  "I will always love you...",
  "Like a prayer...",
  "Billie Jean is not my lover...",
  "Purple rain, purple rain...",
  "Sweet child o' mine...",
  "Livin' on a prayer...",
  
  // Blues
  "The thrill is gone...",
  "Stormy Monday...",
  "Cross road blues...",
  "Born under a bad sign...",
  
  // Reggae
  "No woman, no cry...",
  "One love, one heart...",
  "Three little birds...",
  
  // Alternative/Grunge
  "Smells like teen spirit...",
  "Black hole sun...",
  "Losing my religion...",
  "Creep...",
];

// Get a random musical loading message
export const getRandomMusicalMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * MUSICAL_LOADING_MESSAGES.length);
  return MUSICAL_LOADING_MESSAGES[randomIndex];
};

// Get a random message with context (for more specific loading states)
export const getContextualMusicalMessage = (context?: string): string => {
  const baseMessage = getRandomMusicalMessage();
  
  // You could add context-specific logic here if needed
  // For now, just return the random message
  return baseMessage;
};

export default MUSICAL_LOADING_MESSAGES;
