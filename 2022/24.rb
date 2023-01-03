require "set"

module Day24
  class << self
    $up = [-1, 0]
    $dn = [1, 0]
    $lf = [0, -1]
    $rt = [0, 1]

    $states = {}

    def part_one(input)
      puts "Parsing states..."
      $states = parse_states(input)
      $best_time = $beeg

      # y, x
      start = [-1, 0]
      goal = [$max_y, $max_x]
      puts "Solving..."
      minutes = solve(0, goal, start)
      return minutes + 1
    end

    def part_two(input)
      puts "Parsing states..."
      $states = parse_states(input)
      $best_time = $beeg
      minutes = 0

      # y, x
      $cache = {}
      start = [-1, 0]
      goal = [$max_y, $max_x]
      puts "Solving... way there..."
      minutes = solve(minutes, goal, start)
      $best_time = $beeg
      minutes += 1 # Go into the little corner, takes another minute
      puts "#{minutes} minutes..."

      $cache = {}
      start = [$max_y + 1, $max_x]
      goal = [0, 0]
      puts "Solving... way back..."
      minutes = solve(minutes, goal, start)
      $best_time = $beeg
      minutes += 1 # Go into the little corner, takes another minute
      puts "#{minutes} minutes..."

      $cache = {}
      start = [-1, 0]
      goal = [$max_y, $max_x]
      puts "Solving... way there..."
      minutes = solve(minutes, goal, start)
      minutes += 1 # Go into the little corner, takes another minute
      puts "#{minutes} minutes..."
      return minutes
    end

    $debug = false

    def debug(string)
      if $debug
        puts string
      end
    end

    $beeg = 2 ** 32
    $best_time = $beeg

    $dirs = [
      $dn,
      $rt,
      $lf,
      $up,
    ]

    $max_x = 0
    $max_y = 0

    # Cache is state_index, position to minute.
    # if we've been in this same position with fewer minutes,
    # prune this path as a failure
    $cache = {}

    def solve(minute, goal, pos)
      explore_stack = [[minute, pos]]

      while explore_stack.length > 0
        minute, pos = explore_stack.shift
        next if minute > $best_time
        state_idx = minute % $states.keys.length
        key = [state_idx, pos]
        if $cache.include?(key)
          debug "This key #{key} is in the cache, we are at #{minute} minutes tho"
          if $cache[key] <= minute
            debug "Pruning branch, been to #{pos.to_s} in state #{state_idx} in #{$cache[key]} minutes instead of #{minute}"
            next
          end
        end
        $cache[key] = minute

        # Are we at the end?
        if pos == goal
          if minute < $best_time
            $best_time = minute
            debug "Got to the end in #{minute + 1} minutes"
          end
          next
        end

        # Try moving in each possible direction, and waiting
        minute += 1
        # viable_space = false
        $dirs.each do |dir|
          next_space = [pos[0] + dir[0], pos[1] + dir[1]]
          # is the movement even valid?
          next if next_space[0] < 0 || next_space[0] > $max_y ||
                  next_space[1] < 0 || next_space[1] > $max_x
          # is the new space occupied?
          next if $states[minute % $states.keys.length].include?(next_space)
          # Try exploring this route
          # viable_space = true
          debug "Exploring #{dir.to_s} to #{next_space} for minute #{minute}"
          explore_stack << [minute, next_space]
          # speeds << solve(minute, goal, next_space)
        end

        # Try waiting in the current space
        if !($states[minute % $states.keys.length].include?(pos))
          # viable_space = true
          debug "Trying staying in place at #{pos} for minute #{minute}"
          explore_stack << [minute, pos]
          # speeds << solve(minute, goal, pos)
        end
      end
      return $best_time
    end

    $obstacle_to_dir = {
      "^" => $up,
      "v" => $dn,
      ">" => $rt,
      "<" => $lf,
    }

    def parse_states(input)
      # Set up an initial state for the game board
      height = input.length - 2
      width = input[0].strip.length - 2
      $max_x = width - 1
      $max_y = height - 1

      board = []
      1.step(input.length - 2, 1) { |row|
        # append a new row to the board
        board << []
        1.step(input[row].strip.length - 2, 1) { |col|
          # append a new column to the board
          board.last << []
          # if there is an obstacle here, append it
          if input[row][col] != "."
            board.last.last << input[row][col]
          end
        }
      }

      map_of_states = {}
      map_of_states[0] = board_to_occupied_spaces(board)

      states_to_calculate = height * width
      # HACKER MAGIC NUMBER BS
      states_to_calculate = states_to_calculate > 700 ? 700 : states_to_calculate

      1.step(states_to_calculate - 1, 1) { |minute|
        # debug "Calculating state for minute #{minute}..."
        # Create a new array to hold the new state
        new_board = Array.new(height) { Array.new(width) { Array.new } }
        # debug "New board: #{new_board}"
        # debug "Old board: #{board}"
        # Move all of the obstacles, into their positions in the new state
        0.step(board.length - 1, 1) { |row|
          0.step(board[row].length - 1, 1) { |col|
            board[row][col].each do |obstacle|
              # Find the new row, col for this obstacle
              dir = $obstacle_to_dir[obstacle]
              new_col = col + dir[1]
              new_col = new_col < 0 ? (board[row].length - 1) : new_col
              new_col = new_col > (board[row].length - 1) ? 0 : new_col
              new_row = row + dir[0]
              new_row = new_row < 0 ? (board.length - 1) : new_row
              new_row = new_row > (board.length - 1) ? 0 : new_row
              new_board[new_row][new_col].append(obstacle)
              # debug "#{obstacle} at #{row},#{col} moves to #{new_row},#{new_col}"
              # debug "New board after addition at #{new_row} #{new_col}: #{new_board}"
            end
          }
        }
        # debug "New board done: #{new_board}"
        # make the current state the new state
        # debug "Board size: #{board.length} x #{board[0].length}"
        board = new_board
        map_of_states[minute] = board_to_occupied_spaces(board)
      }
      puts "Calculated #{map_of_states.length} different states for a #{width} x #{height} board"
      map_of_states
    end

    def board_to_occupied_spaces(board)
      occupied_spaces = Set.new
      0.step(board.length - 1, 1) { |row|
        0.step(board[row].length - 1, 1) { |col|
          if board[row][col].length > 0
            occupied_spaces << [row, col]
          end
        }
      }
      occupied_spaces
    end
  end
end

lines = File.readlines("examples/24/24.txt")
# puts Day24.part_one(lines)
# puts Day24.part_two(lines)
lines = File.readlines("inputs/24.txt")
# puts Day24.part_one(lines)
puts Day24.part_two(lines)
