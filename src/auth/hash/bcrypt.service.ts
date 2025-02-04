export abstract class HashingServiceProtocol{
  abstract hashing(password: string): Promise<string>

  abstract compare(password: string, passwordHash: string): Promise<boolean>
}
// Método abstrato pois serão usados em outra classe para serem emplementados de maneira global