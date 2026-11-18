import { getSubjects } from './subjectService'

const subjects = [
  { id: 's1', name: 'Potions', room: 'Cachot de potions', teacherId: 't1' },
  { id: 's2', name: 'Divination', room: 'Tour nord', teacherId: 't2' },
  { id: 's3', name: 'Vol sur balai', room: 'Terrain de Quidditch', teacherId: 't3' },
  { id: 's4', name: 'Matière fantôme', room: 'Salle 0', teacherId: 'inconnu' },
]

const staff = [
  { id: 't1', firstName: 'Severus', lastName: 'Rogue' },
  { id: 't2', firstName: 'Sibylle', lastName: 'Trelawney' },
  { id: 't3', firstName: 'Rolanda', lastName: 'Bibine' },
]

const classes = [
  { id: 'c3', level: 3, subjectIds: ['s1', 's2'] },
  { id: 'c1', level: 1, subjectIds: ['s1', 's3'] },
  { id: 'c2', level: 2, subjectIds: ['s1'] },
  { id: 'c5', level: 5, subjectIds: ['s2'] },
]

const jsonResponse = (body, status = 200) => ({ ok: status < 400, status, json: async () => body })

function mockApi() {
  global.fetch = jest.fn(async (url) => {
    if (url.endsWith('/subjects')) return jsonResponse(subjects)
    if (url.endsWith('/wizards?houseId=null')) return jsonResponse(staff)
    if (url.endsWith('/classes')) return jsonResponse(classes)
    return jsonResponse({}, 404)
  })
}

describe('getSubjects', () => {
  beforeEach(mockApi)
  afterEach(() => jest.restoreAllMocks())

  test('appelle les 3 routes de l’API', async () => {
    await getSubjects()

    const urls = global.fetch.mock.calls.map(([url]) => url)
    expect(urls).toEqual(
      expect.arrayContaining([
        expect.stringContaining('/subjects'),
        expect.stringContaining('/wizards?houseId=null'),
        expect.stringContaining('/classes'),
      ]),
    )
  })

  test('associe chaque matière à son professeur', async () => {
    const result = await getSubjects()
    const potions = result.find((s) => s.id === 's1')

    expect(potions.teacher).toEqual({ id: 't1', firstName: 'Severus', lastName: 'Rogue' })
  })

  test('met teacher à null si le professeur n’existe pas', async () => {
    const result = await getSubjects()
    const ghost = result.find((s) => s.id === 's4')

    expect(ghost.teacher).toBeNull()
  })

  test('trie les niveaux dans l’ordre croissant', async () => {
    const result = await getSubjects()
    const potions = result.find((s) => s.id === 's1')

    expect(potions.levels).toEqual([1, 2, 3])
  })

  test.each([
    ['s1', '1 à 3', 'niveaux qui se suivent'],
    ['s2', '3 et 5', 'niveaux avec un trou'],
    ['s3', '1', 'un seul niveau'],
    ['s4', '—', 'aucun niveau'],
  ])('levelsLabel de %s vaut "%s" (%s)', async (id, expected) => {
    const result = await getSubjects()

    expect(result.find((s) => s.id === id).levelsLabel).toBe(expected)
  })

  test('lève une erreur si le serveur répond une erreur', async () => {
    global.fetch = jest.fn(async () => jsonResponse(null, 500))

    await expect(getSubjects()).rejects.toThrow('Erreur 500')
  })
})
