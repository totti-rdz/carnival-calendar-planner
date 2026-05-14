export interface Flag {
  id: string
  name: string
  emoji: string
}

export const availableFlags: Flag[] = [
  { id: 'de', name: 'Germany', emoji: '🇩🇪' },
  { id: 'fr', name: 'France', emoji: '🇫🇷' },
  { id: 'it', name: 'Italy', emoji: '🇮🇹' },
  { id: 'es', name: 'Spain', emoji: '🇪🇸' },
  { id: 'gb', name: 'UK', emoji: '🇬🇧' },
  { id: 'us', name: 'USA', emoji: '🇺🇸' },
  { id: 'nl', name: 'Netherlands', emoji: '🇳🇱' },
  { id: 'be', name: 'Belgium', emoji: '🇧🇪' },
  { id: 'at', name: 'Austria', emoji: '🇦🇹' },
  { id: 'ch', name: 'Switzerland', emoji: '🇨🇭' },
  { id: 'tt', name: 'Trinidad and Tobago', emoji: '🇹🇹' },
  { id: 'co', name: 'Colombia', emoji: '🇨🇴' },
  { id: 'gd', name: 'Grenada', emoji: '🇬🇩' },
  { id: 'jm', name: 'Jamaica', emoji: '🇯🇲' },
  { id: 'bb', name: 'Barbados', emoji: '🇧🇧' },
  { id: 'ag', name: 'Antigua and Barbuda', emoji: '🇦🇬' },
]
