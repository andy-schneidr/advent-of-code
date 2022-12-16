module Day16
  class << self
    def part_one(input)
      valves = parse_valves(input)
      distance_map = get_distances(valves)
      good_valves = valves.select { |key, valve| valve.rate > 0 }
      result = explore_with_cache("AA", distance_map, good_valves, 30)
    end

    def part_two(input)
      valves = parse_valves(input)
      distance_map = get_distances(valves)
      good_valves = valves.select { |key, valve| valve.rate > 0 }
      result = team_explore("AA", distance_map, good_valves, 26)
    end

    def team_explore(current, distance_map, other_valves, time_left)
      [
        # Take the maximum of:
        # exploring from the current location, given valve states and time left, recursing into this function
        explore(current, distance_map, other_valves, time_left, true),
        # Just straight up how good someone could do exploring with a full 26 minutes, with the given time left.
        explore_with_cache("AA", distance_map, other_valves, 26),
      # Basically.... This is kind of like trying to determine who should open the next valve, and which one.
      ].max
    end

    $cache = {}

    def explore_with_cache(current, distance_map, other_valves, time_left)
      key = [current, other_valves.keys, time_left]
      if $cache.key?(key)
        return $cache[key]
      end
      result = explore(current, distance_map, other_valves, time_left)
      $cache[key] = result
    end

    def explore(current, distance_map, other_valves, time_left, as_team = false)
      results = [0]
      # Given the current location, we have to pick the next valve to go and open
      # let's do a depth-first-search exploration of trying to open each valve and
      # see what leads to the best outcome.
      # look at result of travelling to and opening each valve?
      other_valves.each do |name, valve|
        if distance_map[current][valve.label] >= time_left
          next
        end
        # -1 to open the valve as well
        new_time = time_left - distance_map[current][valve.label] - 1
        remaining_valves = other_valves.clone
        remaining_valves.delete(valve.label)
        best_exploration = 0
        if as_team
          best_exploration = team_explore(valve.label, distance_map, remaining_valves, new_time)
        else
          best_exploration = explore(valve.label, distance_map, remaining_valves, new_time)
        end

        pressure = valve.rate * new_time

        # overall result is the pressure gained from opening this valve, plus best exploration
        results.append(pressure + best_exploration)
      end
      results.max
    end

    def parse_valves(input)
      valves = {}
      input.each do |line|
        name = line[6..7]
        rate = line.scan(/\d+/)[0].to_i
        neighbor_names = line.scan(/[A-Z]{2}/)[1..]
        valves[name] = (Valve.new(name, rate, neighbor_names))
        puts "name: #{valves[name].label} rate: #{valves[name].rate} neighbor_names: #{neighbor_names}"
      end

      valves.each do |name, valve|
        valve.neighbor_names.each do |neighbor|
          valve.add_neighbor(valves[neighbor])
        end
      end
      valves
    end

    def get_distances(valves)
      distances = {}
      # find initial and neighbor distances
      valves.each do |name, valve|
        distances[name] = {}
        valve.neighbor_names.each do |neighbor|
          distances[name][neighbor] = 1
        end
      end

      # set up all other distances
      valves.keys.each do |valve1|
        valves.keys.each do |valve2|
          distances[valve1][valve2] ||= 999
        end
      end

      valves.keys.each do |k|
        valves.keys.each do |j|
          valves.keys.each do |i|
            distances[i][j] = [
              distances[i][j],
              distances[i][k] + distances[k][j],
            ].min
          end
        end
      end
      distances
    end
  end

  class Valve
    attr_accessor :label
    attr_accessor :neighbors
    attr_accessor :neighbor_names
    attr_accessor :rate

    def initialize(label, rate, neighbor_names)
      @neighbors = []
      @label = label
      @rate = rate
      @neighbor_names = neighbor_names
    end

    def add_neighbor(neighbor)
      @neighbors.append(neighbor)
    end
  end
end

lines = File.readlines("examples/16/16.txt")
puts Day16.part_one(lines)
# puts Day16.part_two(lines)
lines = File.readlines("inputs/16.txt")
# puts Day16.part_one(lines)
# puts Day16.part_two(lines)
