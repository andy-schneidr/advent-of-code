module Day19
  class << self
    $cache = {}
    $blueprint_num = 0
    $ore_bot_cost = 0
    $clay_bot_cost = 0
    $obsidian_bot_cost = [0, 0]
    $geode_bot_cost = [0, 0]
    $min_idx = 0
    $ore_idx = 1
    $cly_idx = 2
    $obs_idx = 3
    $geo_idx = 4
    $ore_bot_idx = $ore_idx + 4
    $cly_bot_idx = $cly_idx + 4
    $obs_bot_idx = $obs_idx + 4
    $geo_bot_idx = $geo_idx + 4
    $skipped_idx = $geo_bot_idx + 1
    $max_cly_cost = 0
    $max_ore_cost = 0
    $max_obs_cost = 0
    $debug = false
    $minutes_total = 0

    def part_one(input)
      $minutes_total = 24
      blueprints = parse_blueprints(input)
      results = []
      blueprints.each { |blueprint|
        $blueprint_num = blueprint[0]
        puts "running #{$blueprint_num}..."
        $ore_bot_cost = blueprint[1]
        $cly_bot_cost = blueprint[2]
        $obs_bot_cost = [blueprint[3], blueprint[4]]
        $geo_bot_cost = [blueprint[5], blueprint[6]]
        $cache[$blueprint_num] = 0
        $max_ore_cost = [$ore_bot_cost, $cly_bot_cost, $obs_bot_cost[0], $geo_bot_cost[0]].max
        $max_cly_cost = $obs_bot_cost[1]
        $max_obs_cost = $geo_bot_cost[1]

        results << (simulate([1, 0, 0, 0, 0, 1, 0, 0, 0, 0]) * $blueprint_num)

        # results << State.new(blueprint).simulate
      }
      puts "Results: #{results.to_s}"
      return results.sum
    end

    def part_two(input)
      $minutes_total = 32
      blueprints = parse_blueprints(input)
      results = []
      blueprints[0..2].each { |blueprint|
        $blueprint_num = blueprint[0]
        puts "running #{$blueprint_num}..."
        $ore_bot_cost = blueprint[1]
        $cly_bot_cost = blueprint[2]
        $obs_bot_cost = [blueprint[3], blueprint[4]]
        $geo_bot_cost = [blueprint[5], blueprint[6]]
        $cache[$blueprint_num] = 0
        $max_ore_cost = [$ore_bot_cost, $cly_bot_cost, $obs_bot_cost[0], $geo_bot_cost[0]].max
        $max_cly_cost = $obs_bot_cost[1]
        $max_obs_cost = $geo_bot_cost[1]

        results << simulate([1, 0, 0, 0, 0, 1, 0, 0, 0, 0])

        # results << State.new(blueprint).simulate
      }
      puts "Results: #{results.to_s}"
      return results[0] * results[1] * results[2]
    end

    def parse_blueprints(input)
      result = []
      input.each do |line|
        result << line.scan(/\d+/).map!(&:to_i)
      end
      result
    end

    def simulate(state)
      while state[$min_idx] <= $minutes_total
        break if $cache[$blueprint_num] > most_possible_geodes(state)
        debug "== Minute #{state[$min_idx]} =="
        # 1. build bots
        build_bots_collect_resources(state)
      end
      result = state[$geo_idx]
      if $cache.include?($blueprint_num)
        saved = $cache[$blueprint_num]
        result = saved < result ? result : saved
      end
      $cache[$blueprint_num] = result
      debug "Result of blueprint #{$blueprint_num}: #{$geode} (#{result})"
      result
    end

    def most_possible_geodes(state)
      most = state[$geo_idx]
      geode_bot_count = state[$geo_bot_idx]
      (state[$min_idx]).step($minutes_total, 1) { |min|
        most += geode_bot_count
        geode_bot_count += 1
      }
      most
    end

    def build_bots_collect_resources(state)
      # 1. if you have enough to make a geode bot, make a geode bot
      if $geo_bot_cost[0] <= state[$ore_idx] && $geo_bot_cost[1] <= state[$obs_idx]
        collect_resources(state)
        build_geode_bot(state)
        state[$skipped_idx] = 0
        state[$min_idx] += 1
        return
      end

      if $obs_bot_cost[0] <= state[$ore_idx] && $obs_bot_cost[1] <= state[$cly_idx] &&
         state[$obs_bot_idx] < $max_obs_cost
        # Could we not have built this last turn?
        if !(state[$skipped_idx] == 1 &&
             ($obs_bot_cost[0] <= (state[$ore_idx] - state[$ore_bot_idx]) &&
              $obs_bot_cost[1] <= (state[$cly_idx] - state[$cly_bot_idx])))
          new_state = state.clone
          collect_resources(new_state)
          build_obsidian_bot(new_state)
          new_state[$min_idx] += 1
          new_state[$skipped_idx] = 0
          simulate(new_state)
        end
      end

      if $cly_bot_cost <= state[$ore_idx] && state[$cly_bot_idx] < $max_cly_cost
        # Could we not have built this last turn?
        if !(state[$skipped_idx] == 1 && ($cly_bot_cost <= (state[$ore_idx] - state[$ore_bot_idx])))
          new_state = state.clone
          collect_resources(new_state)
          build_clay_bot(new_state)
          new_state[$skipped_idx] = 0
          new_state[$min_idx] += 1
          simulate(new_state)
        end
      end

      if $ore_bot_cost <= state[$ore_idx] && state[$ore_bot_idx] < $max_ore_cost
        # Could we not have built this last turn?
        if !(state[$skipped_idx] == 1 && ($ore_bot_cost <= (state[$ore_idx] - state[$ore_bot_idx])))
          new_state = state.clone
          collect_resources(new_state)
          build_ore_bot(new_state)
          new_state[$skipped_idx] = 0
          new_state[$min_idx] += 1
          simulate(new_state)
        end
      end

      collect_resources(state)
      state[$skipped_idx] = 1
      state[$min_idx] += 1
    end

    def build_geode_bot(state)
      if $geo_bot_cost[0] <= state[$ore_idx] && $geo_bot_cost[1] <= state[$obs_idx]
        debug "Spend #{$geo_bot_cost[0]} ore and #{$geo_bot_cost[1]} obsidian to start building a geode-cracking bot"
        state[$ore_idx] -= $geo_bot_cost[0]
        state[$obs_idx] -= $geo_bot_cost[1]
        state[$geo_bot_idx] += 1
        return true
      end
      return false
    end

    def build_obsidian_bot(state)
      if $obs_bot_cost[0] <= state[$ore_idx] && $obs_bot_cost[1] <= state[$cly_idx]
        debug "Spend #{$obs_bot_cost[0]} ore and #{$obs_bot_cost[1]} clay to start building an obsidian-collecting bot"
        state[$ore_idx] -= $obs_bot_cost[0]
        state[$cly_idx] -= $obs_bot_cost[1]
        state[$obs_bot_idx] += 1
        return true
      end
      return false
    end

    def build_clay_bot(state)
      if $cly_bot_cost <= state[$ore_idx]
        debug "Spend #{$cly_bot_cost} ore to start building a clay-collecting bot"
        state[$ore_idx] -= $cly_bot_cost
        state[$cly_bot_idx] += 1
        return true
      end
      return false
    end

    def build_ore_bot(state)
      if $ore_bot_cost <= state[$ore_idx]
        debug "Spend #{$ore_bot_cost} ore to start building an ore-collecting bot"
        state[$ore_idx] -= $ore_bot_cost
        state[$ore_bot_idx] += 1
        return true
      end
      return false
    end

    def collect_resources(state)
      ore = state[$ore_bot_idx]
      state[$ore_idx] += ore
      debug "#{state[$ore_bot_idx]} ore-collecting robot(s) collect #{ore} ore; you now have #{state[$ore_idx]} ore."

      clay = state[$cly_bot_idx]
      state[$cly_idx] += clay
      debug "#{state[$cly_bot_idx]} clay-collecting robot(s) collect #{clay} clay; you now have #{state[$cly_idx]} clay." if clay > 0

      obsidian = state[$obs_bot_idx]
      state[$obs_idx] += obsidian
      debug "#{state[$obs_bot_idx]} obsidian-collecting robot(s) collect #{obsidian} obsidian; you now have #{state[$obs_idx]} obsidian." if obsidian > 0

      geodes = state[$geo_bot_idx]
      state[$geo_idx] += geodes
      debug "#{state[$geo_bot_idx]} geode-cracking robot(s) crack #{geodes} geode(s); you now have #{state[$geo_idx]} geode(s)." if geodes > 0
    end

    def debug(string)
      if $debug
        puts string
      end
    end
  end
end

lines = File.readlines("examples/19/19.txt")
# puts Day19.part_one(lines)
# puts Day19.part_two(lines)
lines = File.readlines("inputs/19.txt")
# puts Day19.part_one(lines) # 1350 too low
puts Day19.part_two(lines)
