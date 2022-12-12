module Day12
  class << self
    def part_one(input)
      @best = "a"
      # Recreate a grid of equal size of the puzzle input,
      # containing the steps required to get to each square
      x_size = input[0].strip.length
      y_size = input.length
      steps = Array.new(y_size) { Array.new(x_size, 999999) }
      start = []
      0.step(input.length - 1, 1) { |row|
        0.step(input[row].length - 1, 1) { |col|
          if input[row][col] == "S"
            start = [row, col]
            puts "START POINT: [#{row}, #{col}]"
            break
            # steps[row][col] = 0
          end
        }
      }

      end_pos = []
      0.step(input.length - 1, 1) { |row|
        0.step(input[row].length - 1, 1) { |col|
          if input[row][col] == "E"
            end_pos = [row, col]
          end
        }
      }

      explore(input, steps, start[0], start[1], 0)

      # Might need to search steps for the value at E
      return steps[end_pos[0]][end_pos[1]]
    end

    def explore(input, steps, row, col, current_steps)
      # if the square we've arrived at is "E"
      val = input[row][col]
      next_valid = val.next
      if val == "E"
        # puts "got to E, #{current_steps}"
        # update the steps value here, then return current_steps (???)
        if current_steps < steps[row][col]
          steps[row][col] = current_steps
        end
        return
      end

      # Try to set the number of steps it took to get here
      # if this is a new fastest way to get here, update, keep exploring
      if current_steps < steps[row][col]
        if input[row][col] == @best.next
          @best = input[row][col]
        end
        if input[row][col] == @best
          # puts "Got to #{@best} in #{current_steps}"
        end
        steps[row][col] = current_steps
      else
        return
      end

      # Can we explore up?
      if row > 0
        new_row = row - 1
        new_col = col
        if ok_to_move(val, input[new_row][new_col]) && steps[new_row][new_col] > (current_steps)
          # puts "Going up to #{input[new_row][new_col]} at [#{new_row}, #{new_col}]"
          explore(input, steps, new_row, new_col, current_steps + 1)
        end
      end

      # Down?
      if row < input.length - 1
        new_row = row + 1
        new_col = col
        if ok_to_move(val, input[new_row][new_col]) && steps[new_row][new_col] > (current_steps)
          # puts "Going down to #{input[new_row][new_col]} at [#{new_row}, #{new_col}]"
          explore(input, steps, new_row, new_col, current_steps + 1)
        end
      end

      # Left?
      if col > 0
        new_row = row
        new_col = col - 1
        if ok_to_move(val, input[new_row][new_col]) && steps[new_row][new_col] > (current_steps)
          # puts "Going left to #{input[new_row][new_col]} at [#{new_row}, #{new_col}]"
          explore(input, steps, new_row, new_col, current_steps + 1)
        end
      end

      # Right?
      if col < input[row].strip.length - 1
        new_row = row
        new_col = col + 1
        if ok_to_move(val, input[new_row][new_col]) && steps[new_row][new_col] > (current_steps)
          # puts "Going right to #{input[new_row][new_col]} at [#{new_row}, #{new_col}]"
          explore(input, steps, new_row, new_col, current_steps + 1)
        end
      end
    end

    def ok_to_move(current, next_letter)
      if current == "S"
        return true if next_letter == "a" || next_letter == "b"
      elsif current == next_letter
        return true
      elsif next_letter == "E"
        return true if current == "z" || current == "y"
      elsif current.next == next_letter
        return true
      elsif current.ord > next_letter.ord
        return true
      end
      return false
    end

    def part_two(input)
      @best = "a"
      shortest = 999999
      # Recreate a grid of equal size of the puzzle input,
      # containing the steps required to get to each square
      start_points = []
      0.step(input.length - 1, 1) { |row|
        0.step(input[row].length - 1, 1) { |col|
          if input[row][col] == "S" || input[row][col] == "a"
            input[row][col] = "a"
            start_points.append([row, col])
          end
        }
      }
      puts input

      start_points.each do |start|
        input_copy = Marshal.load(Marshal.dump(input))
        input_copy[start[0]][start[1]] = "S"
        result = part_one(input_copy)
        if result < shortest
          shortest = result
        end
      end

      return shortest
    end
  end
end

lines = File.readlines("examples/12/12.txt")
# puts Day12.part_one(lines)
puts Day12.part_two(lines)
lines = File.readlines("inputs/12.txt")
# puts Day12.part_one(lines)
puts Day12.part_two(lines)
