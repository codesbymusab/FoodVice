export default interface ILocationRepository {
  getDistance(): Promise<unknown>;
}
