module Day16
  class << self
    def part_one(input)
      valves = parse_valves(input)
      valve_states = initialize_valve_states(valves)
      state = State.new(0, 30, valves.keys[0], valve_states, [])
      @best_paths = Hash.new
      @time_waste_check_cache = Hash.new
      @low_pressure_check_cache = Hash.new
      @cached_returns = 0
      @uncached_returns = 0
      @time_cached_returns = 0
      @pressure_cached_returns = 0
      @skips = 0
      result = explore(valves, state)
      puts result.pressure
      puts "cached returns: #{@cached_returns}"
      puts "uncached returns: #{@uncached_returns}"
      puts "time_cached returns: #{@time_cached_returns}"
      puts "pressure_cached returns: #{@pressure_cached_returns}"
      puts "skips: #{@skips}"
      result.print_history
      result.pressure
    end

    def part_two(input)
      # raise NotImplementedError
    end

    def parse_valves(input)
      valves = Hash.new
      input.each do |line|
        name = line[6..7]
        rate = line.scan(/\d+/)[0].to_i
        neighbor_names = line.scan(/[A-Z]{2}/)[1..]
        puts "name: #{name} rate: #{rate} neighbor_names: #{neighbor_names}"
        valves[name] = (Valve.new(name, rate, neighbor_names))
      end

      valves.each do |name, valve|
        valve.neighbor_names.each do |neighbor|
          valve.add_neighbor(valves[neighbor])
        end
      end
      return valves
    end

    def initialize_valve_states(valves)
      states = Hash.new
      valves.each do |name, valve|
        states[name] = 0
      end
      return states
    end

    # Takes a state, returns the best result after exploring all possible options
    def explore(valves, state, from = nil)
      if state.time_left <= 0
        return state
      end
      results = []
      # the key should be a map of a certain position, time left, and valve states, to PRESSURE.
      # if the best paths already has this key, but the current PRESSURE is higher, we need to recompute it
      # if it's equal or lower, I think we can just return what we stored.
      # caching possibilities:
      #   current valve location
      #   time left
      #   total potential pressure so far
      #   valve states

      # do we have a state like this with more pressure?
      pressure_key = state.current_valve_name + state.valve_states.to_s + state.time_left.to_s
      if @low_pressure_check_cache.key?(pressure_key)
        if @low_pressure_check_cache[pressure_key].pressure > state.pressure
          # if we're able to open the same valves, get to this point at the same time, with more pressure,
          # stop exploring this path
          state.time_left = 0
          state.pressure = 0
          @pressure_cached_returns += 1
          return state
        end
      end
      @low_pressure_check_cache[pressure_key] = state

      time_key = state.current_valve_name + state.valve_states.to_s + state.pressure.to_s
      # do we have a state like this with more time?
      if @time_waste_check_cache.key?(time_key)
        if @time_waste_check_cache[time_key].time_left > state.time_left
          # time was was wasted, stop exploring this path
          state.time_left = 0
          state.pressure = 0
          @time_cached_returns += 1
          return state
        end
      end
      @time_waste_check_cache[time_key] = state

      # do we have a state like this with more pressure?
      pressure_key = state.current_valve_name + state.valve_states.to_s + state.time_left.to_s
      if @low_pressure_check_cache.key?(pressure_key)
        if @low_pressure_check_cache[pressure_key].pressure > state.pressure
          # if we're able to open the same valves, get to this point at the same time, with more pressure,
          # stop exploring this path
          state.time_left = 0
          state.pressure = 0
          @pressure_cached_returns += 1
          return state
        end
      end
      @low_pressure_check_cache[time_key] = state

      best_key = time_key + state.time_left.to_s
      if @best_paths.key?(best_key)
        cached = @best_paths[best_key]
        @cached_returns += 1
        return cached
      end
      # if cached.pressure < state.pressure
      # We need to recompute this
      # @best_paths.delete(key)
      # results.append(cached)
      # else
      # return cached
      # end
      # end

      # puts "State time_left: #{state.time_left} Current Valve: #{state.current_valve_name}"
      # If current valve is closed, and its flow is > 0, try opening it
      if state.valve_states[state.current_valve_name] == 0 &&
         valves[state.current_valve_name].rate > 0
        copy = copy_state(state)
        copy.time_left -= 1
        pressure_total = valves[copy.current_valve_name].rate * copy.time_left
        # copy.add_open_to_history(copy.current_valve_name, pressure_total)
        copy.pressure += pressure_total
        copy.valve_states[state.current_valve_name] = 1
        # puts "opening current valve"
        results.append(explore(valves, copy))
      end

      # puts "exploring other valves"
      # Try exploring each of the surrounding valves from the current one
      # puts ""
      # puts valves
      # puts state.current_valve_name
      valves[state.current_valve_name].neighbors.each do |neighbor|
        if valves[state.current_valve_name].neighbors.length > 1 && neighbor.label == from
          @skips += 1
          next
        end
        move_copy = copy_state(state)
        move_copy.time_left -= 1
        move_copy.current_valve_name = neighbor.label
        # move_copy.add_move_to_history(move_copy.current_valve_name)
        results.append(explore(valves, move_copy, state.current_valve_name))
      end

      best = results.max_by { |result| result.pressure }
      # @time_waste_check_cache[time_key] = best
      # @low_pressure_check_cache[pressure_key] = best
      @best_paths[best_key] = best
      @uncached_returns += 1
      return best
    end

    def copy_state(state)
      State.new(state.pressure, state.time_left, state.current_valve_name, state.valve_states.clone, state.history.clone)
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

  class State
    attr_accessor :pressure
    attr_accessor :time_left
    # Just a label name
    attr_accessor :current_valve_name
    attr_accessor :valve_states
    attr_accessor :history

    def initialize(pressure, time_left, current_valve_name, valve_states, history)
      @pressure = pressure
      @time_left = time_left
      @current_valve_name = current_valve_name
      @valve_states = valve_states
      @history = history
    end

    def add_move_to_history(move_to)
      @history.append("Minute #{30 - @time_left}, MOVE to valve #{move_to}")
    end

    def add_open_to_history(open, pressure)
      @history.append("Minute #{30 - @time_left}, OPEN valve #{open}, releasing #{pressure} pressure total.")
    end

    def print_history
      history.each do |line|
        puts line
      end
    end
  end
end

lines = File.readlines("examples/16/16.txt")
# puts Day16.part_one(lines)
# puts Day16.part_two(lines)
lines = File.readlines("inputs/16.txt")
# puts Day16.part_one(lines)
# puts Day16.part_two(lines)
