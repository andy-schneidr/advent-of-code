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

      explore(input, steps, start[0], start[1], 0, "E")

      # Might need to search steps for the value at E
      return steps[end_pos[0]][end_pos[1]]
    end

    def explore(input, steps, row, col, current_steps, end_val)
      val = input[row][col]
      # if the square we've arrived at is an end
      if val == end_val
        # puts "got to end, #{current_steps}"
        # update the steps value here, then return current_steps (???)
        if current_steps < steps[row][col]
          steps[row][col] = current_steps
        end
        return
      end

      # Try to set the number of steps it took to get here
      # if this is a new fastest way to get here, update, keep exploring
      if current_steps < steps[row][col]
        steps[row][col] = current_steps
      else
        return
      end

      new_poss = [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]
      new_poss.each do |new_pos|
        new_row = new_pos[0]
        new_col = new_pos[1]
        if new_row >= 0 && new_row < input.length &&
           new_col >= 0 && new_col < input[new_row].strip.length
          move_ok = ok_to_move(val, input[new_row][new_col])
          if end_val == "a"
            move_ok = ok_to_move(input[new_row][new_col], val)
          end
          if move_ok && steps[new_row][new_col] > (current_steps)
            explore(input, steps, new_row, new_col, current_steps + 1, end_val)
          end
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
      # Recreate a grid of equal size of the puzzle input,
      # containing the steps required to get to each square
      x_size = input[0].strip.length
      y_size = input.length
      steps = Array.new(y_size) { Array.new(x_size, 999999) }
      start = []
      0.step(input.length - 1, 1) { |row|
        0.step(input[row].length - 1, 1) { |col|
          if input[row][col] == "S"
            input[row][col] = "a"
          end
          if input[row][col] == "E"
            start = [row, col]
          end
        }
      }

      explore(input, steps, start[0], start[1], 0, "a")

      shortest = 999999
      0.step(input.length - 1, 1) { |row|
        0.step(input[row].length - 1, 1) { |col|
          if input[row][col] == "a"
            if steps[row][col] < shortest
              shortest = steps[row][col]
            end
          end
        }
      }

      return shortest
    end
  end
end

lines = File.readlines("examples/12/12.txt")
puts Day12.part_one(lines)
puts Day12.part_two(lines)
lines = File.readlines("inputs/12.txt")
puts Day12.part_one(lines)
puts Day12.part_two(lines)
